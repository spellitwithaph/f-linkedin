(function () {
  'use strict';

  let dropdown = null;
  let hideTimer = null;
  let isOverNav = false;
  let isOverDropdown = false;

  const HIDE_DELAY = 400;
  const PREFIX = '[f-linkedin]';

  function findNavLink() {
    return (
      document.querySelector('nav a[href*="notifications"]') ||
      document.querySelector('#global-nav a[href*="notifications"]') ||
      document.querySelector('a[href*="/notifications/"]')
    );
  }

  function isPointInRect(x, y, rect) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  document.addEventListener('mousemove', function (e) {
    const link = findNavLink();
    if (!link) return;

    const navItem = link.closest('li') || link.parentElement;
    if (!navItem) return;

    const rect = navItem.getBoundingClientRect();
    const overNav = isPointInRect(e.clientX, e.clientY, rect);

    let overDropdown = false;
    if (dropdown) {
      const dRect = dropdown.getBoundingClientRect();
      overDropdown = isPointInRect(e.clientX, e.clientY, dRect);
    }

    if (overNav && !isOverNav) {
      isOverNav = true;
      clearTimeout(hideTimer);
      showDropdown(navItem);
    } else if (!overNav && isOverNav) {
      isOverNav = false;
    }

    if (overDropdown && !isOverDropdown) {
      isOverDropdown = true;
      clearTimeout(hideTimer);
    } else if (!overDropdown && isOverDropdown) {
      isOverDropdown = false;
    }

    if (!overNav && !overDropdown && dropdown && dropdown.style.display !== 'none') {
      scheduleHide();
    }

    if ((overNav || overDropdown) && dropdown) {
      clearTimeout(hideTimer);
    }
  }, true);

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (dropdown) dropdown.style.display = 'none';
    }, HIDE_DELAY);
  }

  function showDropdown(navItem) {
    if (!dropdown) createDropdown();
    const rect = navItem.getBoundingClientRect();
    const top = rect.bottom + 4;
    const left = Math.max(4, rect.left + rect.width / 2 - 200);
    dropdown.style.top = top + 'px';
    dropdown.style.left = left + 'px';
    dropdown.style.display = 'block';
  }

  function createDropdown() {
    dropdown = document.createElement('div');
    dropdown.id = 'fli-notif-dropdown';
    Object.assign(dropdown.style, {
      position: 'fixed',
      width: '400px',
      height: '520px',
      zIndex: '2147483647',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
      border: '1px solid #e0e0e0',
      overflow: 'hidden',
      display: 'none',
    });

    const loader = document.createElement('div');
    loader.id = 'fli-loader';
    Object.assign(loader.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#666',
      fontSize: '14px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    });
    loader.textContent = 'Loading notifications…';
    dropdown.appendChild(loader);

    const iframe = document.createElement('iframe');
    iframe.src = '/notifications/';
    iframe.setAttribute('scrolling', 'yes');
    Object.assign(iframe.style, {
      width: '100%',
      height: '100%',
      border: 'none',
      display: 'none',
    });

    iframe.addEventListener('load', () => {
      try {
        const doc = iframe.contentDocument;
        const style = doc.createElement('style');
        style.textContent = `
          /* Hide chrome: nav, sidebar, messaging, footer */
          .global-nav,
          .global-nav__a11y-menu,
          #global-nav,
          header,
          .scaffold-layout__aside,
          .scaffold-layout__toolbar,
          .scaffold-layout-toolbar,
          .scaffold-layout__sidebar,
          .search-global-typeahead,
          .msg-overlay-list-bubble,
          .msg-overlay-container,
          #msg-overlay,
          footer,
          .scaffold-layout__row--footer,
          .premium-upsell,
          .ad-banner-container,
          .share-box-feed-entry,
          .scaffold-finite-scroll__load-button,
          .scaffold-layout__inner > aside {
            display: none !important;
          }

          /* Make the page scrollable within the iframe */
          html {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            height: 100% !important;
          }

          body {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Remove top spacing from hidden nav */
          .scaffold-layout {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }

          .scaffold-layout__inner {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
          }

          .scaffold-layout__main,
          .scaffold-layout__content,
          main {
            margin: 0 !important;
            padding: 8px !important;
            max-width: 100% !important;
            width: 100% !important;
          }

          /* Ensure notification list itself can scroll */
          .scaffold-finite-scroll__content {
            overflow: visible !important;
          }

          /* Force any fixed/sticky positioned elements to be static */
          .scaffold-layout__sticky,
          [style*="position: fixed"],
          [style*="position: sticky"] {
            position: static !important;
          }
        `;
        doc.head.appendChild(style);
      } catch (e) {
        console.warn(PREFIX, 'Could not access iframe document:', e.message);
      }

      loader.style.display = 'none';
      iframe.style.display = 'block';
    });

    dropdown.appendChild(iframe);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown && dropdown.style.display !== 'none') {
        dropdown.style.display = 'none';
      }
    });

    document.addEventListener('click', (e) => {
      if (dropdown && dropdown.style.display !== 'none' && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }, true);

    document.body.appendChild(dropdown);
  }

  window.addEventListener('scroll', () => {
    if (dropdown && dropdown.style.display !== 'none') {
      const link = findNavLink();
      if (link) {
        const navItem = link.closest('li') || link.parentElement;
        if (navItem) showDropdown(navItem);
      }
    }
  });

  console.log(PREFIX, 'Notifications script loaded');
})();
