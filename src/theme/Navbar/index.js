/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useHideableNavbar from "@theme/hooks/useHideableNavbar";
import useTheme from "@theme/hooks/useTheme";
import SearchBar from "@theme/SearchBar";
import Toggle from "@theme/Toggle";
import classnames from "classnames";
import React, { useCallback, useState } from "react";
import styles from "./styles.module.css";

function NavLink({ to, href, label, position, ...props }) {
  const toUrl = useBaseUrl(to);
  return (
    <Link
      className="navbar__item navbar__link"
      {...(href
        ? {
            target: "_blank",
            rel: "noopener noreferrer",
            href
          }
        : {
            activeClassName: "navbar__link--active",
            to: toUrl
          })}
      {...props}
    >
      {label}
    </Link>
  );
}

function SiteLink({
  activeBasePath,
  to,
  href,
  label,
  position,
  logo,
  ...props
}) {
  const toUrl = useBaseUrl(to);
  const activeBaseUrl = useBaseUrl(activeBasePath);

  return (
    <Link
      className="navbar__item navbar__link"
      {...(href
        ? {
            target: "_self",
            rel: "noopener noreferrer",
            href
          }
        : {
            activeClassName: "navbar__link--active",
            to: toUrl,
            ...(activeBasePath
              ? {
                  isActive: (_match, location) =>
                    location.pathname.startsWith(activeBaseUrl)
                }
              : null)
          })}
      {...props}
    >
      <span>
        <div className="avatar">
          <img className="avatar__photo avatar__photo--sm" src={logo} />
          <div className="avatar__intro">
            <h5 className="avatar__name">{label}</h5>
          </div>
        </div>
      </span>
    </Link>
  );
}

function NavMenu(props) {
  return (
    <div className="navbar__item dropdown dropdown--hoverable">
      <a className="navbar__link">{props.label} &#9662;</a>
      <ul className="dropdown__menu">
        {props.items.map((linkItem, i) => (
          <li key={i}>
            <NavLink {...linkItem} key={i} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SiteMenu(props) {
  return (
    <div className="navbar__item dropdown dropdown--hoverable">
      <a className="navbar__link">{props.label}</a>
      <ul className="dropdown__menu">
        {props.items.map((linkItem, i) => (
          <li key={i}>
            <SiteLink {...linkItem} key={i} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Navbar() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const { baseUrl, themeConfig = {} } = siteConfig;
  const { navbar = {}, disableDarkMode = false } = themeConfig;
  const {
    title,
    logo = {},
    links = [],
    menus = [],
    sites = [],
    hideOnScroll = false
  } = navbar;
  const [sidebarShown, setSidebarShown] = useState(false);
  const [menuShown, setMenuShown] = useState({});
  const [isSearchBarExpanded, setIsSearchBarExpanded] = useState(false);
  const [theme, setTheme] = useTheme();

  const { navbarRef, isNavbarVisible } = useHideableNavbar(hideOnScroll);

  const showSidebar = useCallback(() => {
    document.body.style.overflow = "hidden";
    setSidebarShown(true);
  }, [setSidebarShown]);
  const hideSidebar = useCallback(() => {
    document.body.style.overflow = "visible";
    setSidebarShown(false);
  }, [setSidebarShown]);

  const toggleMenu = id => {
    setMenuShown(menuShown => {
      return { ...menuShown, [id]: !menuShown[id] };
    });
  };

  const onToggleChange = useCallback(
    e => setTheme(e.target.checked ? "dark" : ""),
    [setTheme]
  );

  const logoUrl = useBaseUrl(logo.src);
  return (
    <nav
      ref={navbarRef}
      className={classnames("navbar", "navbar--light", "navbar--fixed-top", {
        "navbar-sidebar--show": sidebarShown,
        [styles.navbarHideable]: hideOnScroll,
        [styles.navbarHidden]: !isNavbarVisible
      })}
    >
      <div className="navbar__inner">
        <div className="navbar__items">
          <div
            aria-label="Navigation bar toggle"
            className="navbar__toggle"
            role="button"
            tabIndex={0}
            onClick={showSidebar}
            onKeyDown={showSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              role="img"
              focusable="false"
            >
              <title>Menu</title>
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M4 7h22M4 15h22M4 23h22"
              />
            </svg>
          </div>
          <Link className="navbar__brand" to={baseUrl}>
            {logo != null && (
              <img className="navbar__logo" src={logoUrl} alt={logo.alt} />
            )}
            {title != null && (
              <strong
                className={isSearchBarExpanded ? styles.hideLogoText : ""}
              >
                {title}
              </strong>
            )}
          </Link>
          {sites
            .filter(siteItem => siteItem.position !== "right")
            .map((siteItem, i) => (
              <SiteMenu {...siteItem} key={i} />
            ))}
          {menus
            .filter(menuItem => menuItem.position !== "right")
            .map((menuItem, i) => (
              <NavMenu {...menuItem} key={i} />
            ))}
          {links
            .filter(linkItem => linkItem.position !== "right")
            .map((linkItem, i) => (
              <NavLink {...linkItem} key={i} />
            ))}
        </div>
        <div className="navbar__items navbar__items--right">
          {sites
            .filter(siteItem => siteItem.position === "right")
            .map((siteItem, i) => (
              <SiteMenu {...siteItem} key={i} />
            ))}
          {menus
            .filter(menuItem => menuItem.position === "right")
            .map((menuItem, i) => (
              <NavMenu {...menuItem} key={i} />
            ))}
          {links
            .filter(linkItem => linkItem.position === "right")
            .map((linkItem, i) => (
              <NavLink {...linkItem} key={i} />
            ))}
          {!disableDarkMode && (
            <Toggle
              className={styles.displayOnlyInLargeViewport}
              aria-label="Dark mode toggle"
              checked={theme === "dark"}
              onChange={onToggleChange}
            />
          )}
          <SearchBar
            handleSearchBarToggle={setIsSearchBarExpanded}
            isSearchBarExpanded={isSearchBarExpanded}
          />
        </div>
      </div>
      <div
        role="presentation"
        className="navbar-sidebar__backdrop"
        onClick={hideSidebar}
      />
      <div className="navbar-sidebar">
        <div className="navbar-sidebar__brand">
          <Link className="navbar__brand" onClick={hideSidebar} to={baseUrl}>
            {logo != null && (
              <img className="navbar__logo" src={logoUrl} alt={logo.alt} />
            )}
            {title != null && <strong>{title}</strong>}
          </Link>
          {!disableDarkMode && sidebarShown && (
            <Toggle
              aria-label="Dark mode toggle in sidebar"
              checked={theme === "dark"}
              onChange={onToggleChange}
            />
          )}
        </div>
        <div className="navbar-sidebar__items">
          <div className="menu">
            <ul className="menu__list">
              {sites.map((siteItem, i) => {
                var className = menuShown[i]
                  ? "menu__list-item"
                  : "menu__list-item menu__list-item--collapsed";

                return (
                  <li className={className} key={i}>
                    <a
                      className="menu__link menu__link--sublist"
                      onClick={() => toggleMenu(i)}
                    >
                      {siteItem.label}
                    </a>
                    <ul className="menu__list">
                      {siteItem.items.map((item, i) => (
                        <li className="menu__list-item" key={i}>
                          <SiteLink
                            className="menu__link"
                            {...item}
                            onClick={hideSidebar}
                          />
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
              {menus.map((menuItem, i) => {
                var className = menuShown[i]
                  ? "menu__list-item"
                  : "menu__list-item menu__list-item--collapsed";

                return (
                  <li className={className} key={i}>
                    <a
                      className="menu__link menu__link--sublist"
                      onClick={() => toggleMenu(i)}
                    >
                      {menuItem.label}
                    </a>
                    <ul className="menu__list">
                      {menuItem.items.map((item, i) => (
                        <li className="menu__list-item" key={i}>
                          <NavLink
                            className="menu__link"
                            {...item}
                            onClick={hideSidebar}
                          />
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
              {links.map((linkItem, i) => (
                <li className="menu__list-item" key={i}>
                  <NavLink
                    className="menu__link"
                    {...linkItem}
                    onClick={hideSidebar}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
