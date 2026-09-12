import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

output_dir = Path("/tmp/spark-meetup-page-qa")
output_dir.mkdir(parents=True, exist_ok=True)
site_url = os.environ.get("SPARK_SITE_URL", "http://127.0.0.1:4173")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    errors = []

    desktop = browser.new_context(
        viewport={"width": 1440, "height": 1000},
        device_scale_factor=1,
        permissions=["clipboard-read", "clipboard-write"],
    ).new_page()
    desktop.on("console", lambda message: errors.append(f"console:{message.type}:{message.text}") if message.type == "error" else None)
    desktop.on("pageerror", lambda error: errors.append(f"pageerror:{error}"))
    desktop.goto(site_url, wait_until="networkidle")
    assert desktop.title() == "Spark 上海独立开发者分享会｜深度学习档案"
    assert desktop.locator("#toc a").count() == 12
    assert desktop.locator("#report h2").count() == 12
    assert desktop.locator("text=先卖后做的核心是提前接触约束。").count() == 1
    assert desktop.locator("text=完整时间线 ↗").get_attribute("href").startswith("https://github.com/")
    assert desktop.locator('.wechat-copy').get_attribute('data-wechat') == 'siuserxiaowei'
    assert desktop.locator('a[href="https://x.com/_HIT_SZ_"]').count() == 1
    assert desktop.locator('a[href="https://github.com/siuserxiaowei/spark-meetup-deep-dive"]').count() >= 1
    assert desktop.locator('.creator-strip').bounding_box()['y'] < desktop.locator('.hero').bounding_box()['y']
    assert desktop.locator('.lang-toggle').get_attribute('href') == 'en/'
    desktop.locator('.wechat-copy').click()
    expect(desktop.locator('#wechat-copy-status')).to_have_text('已复制')
    desktop.locator(".theme-toggle").click()
    assert desktop.locator("html").get_attribute("data-theme") == "dark"
    assert desktop.locator(".theme-toggle").get_attribute("aria-pressed") == "true"
    desktop.locator("#toc a").nth(3).click()
    desktop.wait_for_timeout(350)
    active_id = desktop.locator("#report h2").nth(3).get_attribute("id")
    assert desktop.evaluate("decodeURIComponent(location.hash.slice(1))") == active_id
    desktop.screenshot(path=str(output_dir / "desktop.png"), full_page=False)

    mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    mobile.on("console", lambda message: errors.append(f"mobile-console:{message.type}:{message.text}") if message.type == "error" else None)
    mobile.on("pageerror", lambda error: errors.append(f"mobile-pageerror:{error}"))
    mobile.goto(site_url, wait_until="networkidle")
    assert mobile.locator(".hero h1").is_visible()
    assert mobile.locator(".fact-strip").evaluate("el => getComputedStyle(el).gridTemplateColumns.split(' ').length") == 2
    assert mobile.locator("#toc").evaluate("el => getComputedStyle(el).gridTemplateColumns.split(' ').length") == 1
    assert mobile.locator(".report-content table").first.evaluate("el => getComputedStyle(el).overflowX") == "auto"
    assert mobile.locator('.creator-links').evaluate("el => getComputedStyle(el).gridTemplateColumns.split(' ').length") == 3
    mobile.screenshot(path=str(output_dir / "mobile.png"), full_page=False)

    en_page = browser.new_context(
        viewport={"width": 1440, "height": 1000},
        device_scale_factor=1,
        permissions=["clipboard-read", "clipboard-write"],
    ).new_page()
    en_page.on("console", lambda message: errors.append(f"en-console:{message.type}:{message.text}") if message.type == "error" else None)
    en_page.on("pageerror", lambda error: errors.append(f"en-pageerror:{error}"))
    en_page.goto(f"{site_url}/en/", wait_until="networkidle")
    assert en_page.title() == "Spark Indie Hackers Meetup in Shanghai | Deep Learning Archive"
    assert en_page.locator("#toc a").count() == 12
    assert en_page.locator("#report h2").count() == 12
    assert en_page.locator('.lang-toggle').get_attribute('href') == '../'
    assert en_page.locator('a[href="#the-bottom-line-first"]').count() >= 1
    assert en_page.locator('link[href="../assets/styles.css"]').count() == 1
    en_page.locator('.wechat-copy').click()
    expect(en_page.locator('#wechat-copy-status')).to_have_text('Copied')
    en_page.locator(".theme-toggle").click()
    assert en_page.locator("html").get_attribute("data-theme") == "dark"
    en_page.locator("#toc a").nth(3).click()
    en_page.wait_for_timeout(350)
    en_active_id = en_page.locator("#report h2").nth(3).get_attribute("id")
    assert en_page.evaluate("decodeURIComponent(location.hash.slice(1))") == en_active_id
    en_page.screenshot(path=str(output_dir / "desktop-en.png"), full_page=False)

    browser.close()

    if errors:
        raise AssertionError("Browser errors: " + " | ".join(errors))
    print("OK: desktop and mobile page QA passed")
