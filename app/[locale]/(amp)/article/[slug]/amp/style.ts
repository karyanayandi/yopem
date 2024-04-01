export const htmlStyle = `
 * {
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, segoe ui, helvetica neue, Arial, noto sans, sans-serif, apple color emoji, segoe ui emoji, segoe ui symbol, noto color emoji;
}

#dark-mode-wrapper {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
}

.spinner,
input[type=checkbox]#sidebar-trigger {
    box-sizing: border-box;
    transition-property: all;
    transition-timing-function: cubic-bezier(.4, 0, .2, 1);
    transition-duration: .3s;
    animation-duration: .3s;
}

input[type=checkbox]#sidebar-trigger {
    display: none;
}

.sidebar-container {
    position: fixed;
    left: 0;
    top: 4rem;
    z-index: 5;
    height: 100%;
    width: 250px;
    transform: translateX(-100%);
    border-right: 1px solid hsl(var(--border));
    background-color: hsl(var(--background));
    padding-top: 3px;
    transition-property: transform;
    transition-duration: 250ms;
    transition-timing-function: ease-in-out;
}

.sidebar-trigger:checked+.sidebar-container {
    transform: translateX(0);
}


@media (min-width: 768px) {
    .sidebar-trigger:checked~main {
        padding-left: 250px;
    }

    .sidebar-trigger:checked~footer {
        padding-left: 250px;
    }
    .amp-ad-content {
        margin-left: 0px;
        width: 100%;
    }
}


main {
    width: 100%;
    margin: 64px 0 0;
    overflow-x: hidden;
    transition-property: padding;
    transition-duration: 250ms;
    transition-timing-function: ease-in-out;
}


.amp-ad-content {
    margin-left: -16px;
    width: 100vw;
    margin-top: 8px;
    margin-bottom: 8px;
}

.amp-ad-header {
    margin: 64px auto 0;
}

.header-container {
    position: fixed;
    top: 0;
    z-index: 999;
    margin: auto;
    display: flex;
    height: 64px;
    width: 100%;
    max-width: 100%;
    align-items: center;
    background-color: hsl(var(--background));
    padding-left: 60px;
    padding-right: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar-icon-toggle {
    position: fixed;
    left: 16px;
    top: 24px;
    z-index: 20;
    box-sizing: border-box;
    height: 24px;
    width: 24px;
    cursor: pointer;
    transition: all 0.3s;
}

.sidebar-nav {
    position: relative;
    display: flex;
    width: 100%;
    flex-direction: column;
}

.sidebar-items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    border-bottom: 1px solid hsl(var(--border));
    padding: 1rem;
    margin: 0;
}

.sidebar-items li {
    list-style: none;
}

.sidebar-link {
    display: flex;
    transform: translateX(0);
    align-items: center;
    transition: transform 200ms ease-in;
}

.sidebar-link:hover {
    transform: translateX(0.5rem);
}

.sidebar-p {
    display: inline-flex;
    align-items: center;
    font-weight: bold;
    margin: 0;
}

.sidebar-p:hover {
    color: hsl(var(--primary));
}

.sidebar-item-svg {
    display: inline-block;
    font-size: 1rem;
    margin-right: 0.5rem;
}

.spinner {
    position: absolute;
    box-sizing: border-box;
    height: 3px;
    width: 100%;
    transition: all 0.3s;
    background-color: hsl(var(--foreground));
}

.horizontal {
    position: relative;
    float: left;
    margin-top: 3px;
    box-sizing: border-box;
    transition: all 0.3s;
}

.diagonal.part-1 {
    position: relative;
    float: left;
    box-sizing: border-box;
    transition: all 0.3s;
}

.diagonal.part-2 {
    position: relative;
    float: left;
    margin-top: 3px;
    box-sizing: border-box;
    transition: all 0.3s;
}

.amp-logo {
    display: flex;
}

.amp-comment-count {
    margin-bottom: 1rem;
    display: inline-flex;
    align-items: center;
    font-size: 1.125rem/* 18px */;
    line-height: 1.75rem/* 28px */;
    font-weight: 600;
    color: hsl(var(--foreground));
  }
  .amp-comment-action {
    margin: wrem 0px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .amp-comment-action a {
    background-color: hsl(var(--main));
    padding: 0.75rem 0.5rem;
    font-weight: 700;
    color: #fff;
    display: flex; 
    border-radius: var(--radius);
  }
.amp-comment-container {
    display: block;
}

.amp-comment-lists {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0;
}

.amp-comment-item {
    position: relative;
    display: flex;
    flex-direction: column;
}

.amp-comment-item figcaption, .amp-comment-reply-item figcaption {
    margin-bottom: 4px;
    display: flex;
    flex: 1 1 0%;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.5rem
        /* 8px */
    ;
}

.amp-comment-item-img {
    position: relative;
    height: 2.5rem
        /* 40px */
    ;
    width: 2.5rem
        /* 40px */
    ;
    overflow: hidden;
    border-radius: 9999px;
    background-color: hsl(var(--muted));
}

.amp-comment-item-content {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem
        /* 8px */
    ;
}

.amp-comment-author-name {
    display: flex;
    align-items: center;
    gap: 0.25rem
        /* 4px */
    ;
}

.amp-comment-author-name h1 {
    font-size: 13px;
    font-weight: 700;
    margin: 0;
}

.amp-comment-date {
    font-size: 0.75rem
        /* 12px */
    ;
    line-height: 1rem
        /* 16px */
    ;
    font-weight: 700;
}

.amp-comment-content {
    font-size: 14px;
}

.amp-comment-reply-container {
    position: relative;
    margin-left: 3rem
        /* 48px */
    ;
    display: flex;
    flex-direction: column;
    margin-left: 3.5rem
        /* 56px */
    ;
}

.amp-comment-reply-item {
    display: flex;
    justify-content: space-between;
}

.amp-comment-reply-img {
    position: relative;
    height: 1.5rem
        /* 24px */
    ;
    width: 1.5rem
        /* 24px */
    ;
    overflow: hidden;
    border-radius: 9999px;
    background-color: hsl(var(--muted));
}

@media (min-width: 768px) {
    .amp-comment-item figcaption {
        gap: 1rem
            /* 16px */
        ;
    }


    .amp-comment-reply-img {
        height: 2.5rem
            /* 40px */
        ;
        width: 2.5rem
            /* 40px */
        ;
    }
}

figure table {
    margin: 0px;
    width: 100%;
    max-width: calc(100% - 10px);
    table-layout: fixed;
    border-collapse: collapse;
    overflow: hidden;
}

figure table td,
.wp-body table th,
.figure table th {
    position: relative;
    box-sizing: border-box;
    min-width: 1em;
    border-width: 2px;
    border-style: solid;
    --tw-border-opacity: 1;
    border-color: rgb(206 212 218 / var(--tw-border-opacity));
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 3px;
    padding-bottom: 3px;
    vertical-align: top;
}

figure amp-img {
    max-width: 100%;
}

.center-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.amp-wp-meta-terms {
    margin-bottom: 15px;
    line-height: 14px;
    display: block;
}

.amp-wp-meta-terms>div {
    margin: 0;
    display: inline-block;
}

.amp-wp-breadcrumb {
    display: none;
}

.amp-share-container {
    display: grid;
    width: 100%;
    grid-auto-flow: column;
    grid-template-rows: 1fr;
    gap: .5rem;
    margin: 10px 0;
}

.amp-share-facebook {
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    padding: 3px 6px;
    font-size: 16px;
    font-weight: normal;
    background-color: #314E89;
    color: #314E89;
    transition: background-color 0.2s ease-in-out;
}

.amp-share-facebook:hover {
    background-color: rgba(49, 78, 137, 0.7);
}

.amp-share-facebook-button {
    border: none;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    /* Sets font size to 14px (assuming text-sm translates to 14px) */
    font-weight: medium;
    /* Sets font weight to medium */
    transition: color 0.2s ease-in-out;
    /* Applies transition for focus state */
    /* Focus state */
    /* Disabled state */
    /* Hover state */
    /* Additional properties */
    margin: 0 auto;
    /* Centers horizontally */
    margin-bottom: 0px;
    /* Removes margin-bottom */
    height: 36px;
    /* Sets height to 36px (assuming size-10 translates to 36px) */
    width: 36px;
    /* Sets width to 36px */
    flex-grow: 0;
    /* Disables flex-grow */
    border-radius: 50%;
    /* Sets rounded corners to 50% for full circle */
    background-color: transparent;
}

.amp-share-facebook-button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ring-2-color);
    border-radius: 100%;
}

.amp-share-facebook-button[disabled] {
    opacity: 0.5;
    pointer-events: none;
}

.amp-share-facebook-button:hover {
    background-color: transparent;
}

.amp-share-x {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    /* Sets rounded corners (16px is lg, so 8px is half) */
    padding: 6px 12px;
    font-size: 16px;
    font-weight: normal;
    background-color: #000000;
    color: #fff;
    /* Sets text color to white */
    transition: background-color 0.2s ease-in-out;
}

.amp-share-x:hover {
    background-color: rgba(0, 0, 0, 0.88);
}

.amp-share-x-button {
    border: none;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: medium;
    transition: color 0.2s ease-in-out;
    /* Focus state */
    /* Disabled state */
    /* Hover state */
    /* Additional properties */
    margin: 0 auto;
    /* Centers horizontally */
    margin-bottom: 0px;
    /* Removes margin-bottom */
    height: 36px;
    /* Assuming size-10 translates to 36px */
    width: 36px;
    /* Assuming size-10 translates to 36px */
    flex: 0 0 auto;
    /* Disables flex-grow and sets minimum width */
    border-radius: 50%;
    /* Sets rounded corners to 50% for full circle */
    background-color: transparent;
}

.amp-share-x-button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ring-2-color);
    border-radius: 100%;
}

.amp-share-x-button[disabled] {
    opacity: 0.5;
    pointer-events: none;
}

.amp-share-x-button:hover {
    background-color: transparent;
}


.amp-share-email {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    padding: 6px 12px;
    font-size: 16px;
    font-weight: normal;
    background-color: #102641cc;
    background-blend-mode: multiply;
    opacity: 0.8;
    transition: background-opacity 0.2s ease-in-out;
}

.amp-share-email:hover {
    background-opacity: 0.7;
    /* Sets hover background opacity to 70% */
}

.amp-share-email-button {
    border: none;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: medium;
    transition: color 0.2s ease-in-out;
    /* Focus state */
    /* Disabled state */
    /* Hover state */
    /* Additional properties */
    margin: 0 auto;
    /* Centers horizontally */
    margin-bottom: 0px;
    /* Removes margin-bottom */
    height: 36px;
    /* Assuming size-10 translates to 36px */
    width: 36px;
    /* Assuming size-10 translates to 36px */
    flex: 0 0 auto;
    /* Disables flex-grow and sets minimum width */
    border-radius: 50%;
    /* Sets rounded corners to 50% for full circle */
    background-color: transparent;
}

.amp-share-email-button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ring-2-color);
    border-radius: 100%;
}

.amp-share-email-button[disabled] {
    opacity: 0.5;
    pointer-events: none;
}

.amp-share-email-button:hover {
    background-color: transparent;
}

.amp-share-whatsapp {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    padding: 6px 12px;
    font-size: 16px;
    font-weight: normal;
    background-color: #22C35E;
    transition: background-color 0.2s ease-in-out;
}

.amp-share-whatsapp:hover {
    background-color: rgba(34, 195, 94, 0.7);
}

.amp-share-whatsapp-button {
    border: none;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: medium;
    transition: color 0.2s ease-in-out;
    /* Focus state */
    /* Disabled state */
    /* Hover state */
    /* Additional properties */
    margin: 0 auto;
    /* Centers horizontally */
    margin-bottom: 0px;
    /* Removes margin-bottom */
    height: 36px;
    /* Assuming size-10 translates to 36px */
    width: 36px;
    /* Assuming size-10 translates to 36px */
    flex: 0 0 auto;
    /* Disables flex-grow and sets minimum width */
    border-radius: 50%;
    /* Sets rounded corners to 50% for full circle */
    background-color: transparent;
}

.amp-share-whatsapp-button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ring-2-color);
    border-radius: 100%;
}

.amp-share-whatsapp-button[disabled] {
    opacity: 0.5;
    pointer-events: none;
}

.amp-share-whatsapp-button:hover {
    background-color: transparent;
}

.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.amp-dark-mode-container {
    position: relative;
    display: flex;
    height: 1.75rem;
    width: 52px;
    align-items: center;
    border-radius: 9999px;
    /* Sesuaikan dengan kebutuhan */
    background-color: hsl(var(--border))
        /* Sesuaikan dengan kelas bg-border di Tailwind */
    ;
    transition: all 200ms linear;
}

.amp-dark-mode-button {
    border: none;
    position: absolute;
    left: 0;
    margin-left: 2px;
    margin-right: 2px;
    display: flex;
    height: 1.5rem
        /* 24px */
    ;
    width: 1.5rem
        /* 24px */
    ;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background-color: hsl(var(--background));
    transform: translateX(0) transition: all 100ms linear;
    color: hsl(var(--foreground));
}

#dark-mode-switcher-dark.amp-dark-mode-button {
    transform: translateX(100%);
}

.dark-mode #dark-mode-switcher-dark {
    display: flex;
}

#dark-mode-switcher-dark {
    display: none;
}

.dark-mode #dark-mode-switcher-light {
    display: none;
}

#dark-mode-switcher-light {
    display: flex;
}

.amp-wp-tax-category,
.amp-wp-tax-tag {
    font-size: smaller;
    line-height: 1.4em;
    margin: 0 0 1em;
}

.amp-wp-tax-category a,
.amp-wp-tax-tag a {
    border-radius: 100em;
}

.amp-wp-tax-category a,
.amp-wp-tax-tag a {
    color: hsl(var(--foreground));
    background: hsl(var(--muted));
    display: inline-block;
    line-height: normal;
    padding: 3px 8px;
    margin: 0 3px 5px 0;
    -webkit-transition: all .2s linear;
    -o-transition: all .2s linear;
    transition: all .2s linear;
}

.amp-wp-tax-category a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 500;
    outline: none;
    border-radius: 9999px;
    padding: 5px 9px;
    margin-bottom: 0.5rem;
    height: auto;
    background-color: hsl(var(--muted));
    opacity: 1;
    pointer-events: auto;
    transition: all 300ms ease-in-out;
    text-transform: uppercase;
    color: hsl(var(--foreground));
}

.amp-wp-tax-tag a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    transition: color 300ms ease-in-out, background-color 300ms ease-in-out;
    outline: none;
    border: 2px solid transparent;
    border-radius: 0.375rem;
    padding: 5px 9px;
    height: auto;
    background-color: hsl(var(--main));
    color: hsl(var(--info-foreground));
}

.amp-wp-author a,
.amp-wp-author time {
    font-size: 1rem;
}

@media screen and (max-width: 576px) {
    .amp-wp-meta {
        font-size: smaller;
    }
}

.amp-wp-meta {
    list-style: none;
    font-size: 1em;
    padding: 0;
}

.amp-wp-meta li {
    font-size: 12px;
}

.amp-wp-meta li {
    display: flex;
    line-height: 1;
    font-size: 12px;
    align-items: center;
    gap: 15px;
}

.amp-wp-byline amp-img,
.amp-wp-byline .amp-wp-author {
    border-radius: 50%;
}

.amp-wp-author {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.amp-wp-author a {
    color: hsl(var(--primary));
    font-weight: bold;
}

.post-title {
    font-size: 1.8em;
}

.post-content {
    overflow-wrap: break-word;
    font-size: 1.125rem;
    line-height: 1.75rem;
}

.post-image amp-img {
    object-fit: cover;
    border-radius: .75rem;
    overflow: hidden;
    aspect-ratio: 16 / 9;
    min-width: 100%;
}

.post-content .IRPP_kangoo:hover .ctaText,
.post-content .IRPP_kangoo:hover .postTitle {
    opacity: .6;
    transition-property: opacity;
    transition-timing-function: cubic-bezier(.4, 0, .2, 1);
    transition-duration: .2s;
    animation-duration: .2s;
}

.post-content .has-fixed-layout {
    width: 100%;
    table-layout: fixed;
}

.post-content td,
.post-content th {
    border-width: 1px;
    padding: .75rem;
}

.post-content .wp-block-button {
    position: relative;
    margin: 0;
    display: inline-flex;
    height: 2.25rem;
    min-width: 2.5rem;
    flex-shrink: 0;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    border-radius: .75rem;
    border-width: 1px;
    padding-left: 1rem;
    padding-right: 1rem;
    vertical-align: middle;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    line-height: 1.25;
    outline: 2px solid transparent;
    outline-offset: 2px;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(.4, 0, .2, 1);
    transition-duration: 75ms;
    transition-timing-function: cubic-bezier(0, 0, .2, 1);
    animation-duration: 75ms;
    animation-timing-function: cubic-bezier(0, 0, .2, 1);
}

.post-content .wp-block-button:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
}

.post-content .wp-block-button:disabled {
    cursor: not-allowed;
    opacity: .6;
    --tw-shadow: 0 0 #0000;
    --tw-shadow-colored: 0 0 #0000;
}
.post-content li {
    margin-bottom: .5rem;
    margin-left: 1.5rem;
    list-style-type: disc;
    font-size: 1rem;
    line-height: 1.5rem;
}

.post-content ul li {
    margin-left: 3rem;
    color: hsl(var(--foreground) / .9);
}

@media (min-width: 768px){
.article-body li, .download-body li, .post-content li {
    margin-left: 3rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
}
}
.post-content>div>a>div {
    margin-top: 36px;
    margin-bottom: 36px;
    border-left-width: 4px;
    border-left-style: solid;
    border-color: hsl(var(--primary));
    background-color: hsl(var(--primary) / 0.1);
    padding-top: 18px;
    padding-bottom: 18px;
    color: hsl(var(--foreground));
}

.post-content>div>a>div>span.postTitle {
    text-decoration-line: underline;
}

.post-content>div>a>div>span.ctaText {
    font-weight: 700;
}

.post-content img {
    position: relative;
    height: auto;
    width: auto;
    border-radius: 1rem;
}

.post-content .wp-block-embed__wrapper .twitter-tweet.twitter-tweet-rendered {
    margin-left: auto;
    margin-right: auto;
}

.post-content p.ez-toc-title {
    order: 2;
    margin-bottom: unset;
    cursor: pointer;
    padding-bottom: .5rem;
    padding-left: .25rem;
}

.post-content .tableWrapper {
    overflow-x: auto;
}

.post-content table th,
.post-content table th {
    --tw-bg-opacity: 1;
    text-align: left;
    font-weight: 700;
}

.post-content table {
    margin: 0;
    width: 100%;
    max-width: calc(100% - 10px);
    table-layout: fixed;
    border-collapse: collapse;
    overflow: hidden;
}

.post-content pre {
    overflow-x: auto;
    padding: .75rem 1rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
}

.post-content pre code {
    background-color: none;
    padding: 0;
    font-size: .8rem;
    color: inherit;
}

.post-content pre .hljs-emphasis {
    font-style: italic;
}

.post-content pre .hljs-strong {
    font-weight: 700;
}

.post-content mark {
    border-radius: .75rem;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    padding: .125rem 0;
}

.post-content h1,
.post-content h2,
.post-content h3,
.post-content h4,
.post-content h5,
.post-content h6 {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

@media (min-width: 768px) {

    .post-content h1,
    .post-content h2,
    .post-content h3,
    .post-content h4,
    .post-content h5,
    .post-content h6 {
        font-size: 2.25rem;
        line-height: 2.5rem;
    }
}

.post-content h2 {
    font-size: 1.25rem;
    line-height: 1.75rem;
}

@media (min-width: 768px) {
    .post-content h2 {
        font-size: 1.875rem;
        line-height: 2.25rem;
    }
}

.post-content h3 {
    font-size: 1.125rem;
    line-height: 1.75rem;
}

@media (min-width: 768px) {
    .post-content h3 {
        font-size: 1.5rem;
        line-height: 2rem;
    }
}

.post-content h4 {
    font-size: 1rem;
    line-height: 1.5rem;
}

@media (min-width: 768px) {
    .post-content h4 {
        font-size: 1.25rem;
        line-height: 1.75rem;
    }
}

.post-content a {
    font-weight: 600;
    transition-duration: .2s;
    animation-duration: .2s;
}

.post-content p {
    overflow-wrap: break-word;
    font-size: 1.2rem;
    line-height: 1.6rem;
}

@media (min-width: 768px) {
    .post-content p {
        font-size: 1.125rem;
        line-height: 1.75rem;
        line-height: 32px;
    }
}

.post-content p:not(:last-child) {
    margin-bottom: 1.5rem;
}

.post-content img {
    height: auto;
    max-height: 100%;
    max-width: 100%;
    border-radius: .75rem;
}

.post-content li {
    margin-bottom: .5rem;
    margin-left: 1.5rem;
    list-style-type: disc;
    font-size: 1rem;
    line-height: 1.5rem;
}

@media (min-width: 768px) {
    .post-content li {
        margin-left: 3rem;
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
}

.post-content ul {
    position: relative;
}

.post-content ol li,
.post-content ul li {
    margin-left: 3rem;
}

.post-content ol li,
.post-content ol li {
    list-style-type: decimal;
}

.post-content figure {
    margin: 1rem 0;
}

.post-content iframe {
    position: relative;
    margin: 0 auto;
    aspect-ratio: 16/9;
    height: auto;
    width: 100%;
    border-radius: .75rem;
    vertical-align: baseline;
}

.post-content figcaption {
    text-align: center;
    font-size: .75rem;
    line-height: 1rem;
    font-style: italic;
}

.post-content hr {
    margin-left: 1rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
    color: hsl(var(--border));
}

:is(.dark .post-content .IRPP_kangoo .ctaText) {
    color: #ffffff9c;
}

.post-content .IRPP_kangoo:hover .ctaText,
.post-content .IRPP_kangoo:hover .postTitle {
    opacity: .6;
    transition-property: opacity;
    transition-timing-function: cubic-bezier(.4, 0, .2, 1);
    transition-duration: .2s;
    animation-duration: .2s;
}

.post-content .has-fixed-layout {
    width: 100%;
    table-layout: fixed;
}

.post-content img {
    position: relative;
    height: auto;
    width: auto;
    border-radius: .75rem;
}

div#ez-toc-container {
    width: 100%;
    padding-right: 1.25rem;
}

#ez-toc-container nav ul li {
    margin-bottom: .75rem;
    margin-left: 1rem;
    list-style-type: none;
}

#ez-toc-container {
    position: relative;
    margin-bottom: 1rem;
    display: table;
    border-radius: .75rem;
    padding: 1rem;
}

#ez-toc-container>[type=checkbox],
.cssicon,
.cssiconcheckbox {
    display: none;
}

.post-content .wp-block-embed__wrapper .twitter-tweet.twitter-tweet-rendered {
    margin-left: auto;
    margin-right: auto;
}

.post-content p.ez-toc-title {
    order: 2;
    margin-bottom: unset;
    cursor: pointer;
    padding-bottom: .5rem;
    padding-left: .25rem;
}

.ez-toc-title-container {
    display: flex;
    align-items: center;
}

#ez-toc-container [type=checkbox] {
    position: absolute;
    left: 0;
    height: 30px;
    width: 100%;
    opacity: 0;
}

.ez-toc-title.open-list:after {
    border-left-width: 10px;
    border-top-width: 10px;
    border-left-color: transparent;

}

#ez-toc-container nav {
    margin-bottom: 0;
    margin-top: 0;
    max-height: 0;
    overflow: hidden;
    transition-property: all;
    transition-duration: .15s;
    transition-timing-function: cubic-bezier(.4, 0, .2, 1);
    animation-duration: .15s;
    animation-timing-function: cubic-bezier(.4, 0, .2, 1);
}

a {
    text-decoration: none;
    color: hsl(var(--foreground));
}

.related-title {
    border-bottom-width: 4px;
    font-size: 1.25rem;
    line-height: 1.75rem;
    margin-bottom: 0px 0px 8px;
    color: hsl(var(--primary));
    font-weight: 700;
    border-bottom-color: #e5e7eb;
    border-bottom-style: solid;
}

.related-posts {
    gap: 1rem;
    grid-template-columns: repeat(1, 1fr);
    display: grid;
}

.related-post {
    border-bottom-width: 2px;
    border-color: #e2e8f0;
    border-bottom-style: solid;
    font-weight: 600;
}

.related-post p {
    margin: 0;
}

.post {
    padding: 0px 16px;
    max-width: 700px;
    margin: 0px auto;
}

.post-image {
    margin: 0;
}

.amp-footer-container {
    position: relative;
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: hsl(var(--border));
    transition-property: padding;
    transition-duration: 250ms;
    transition-timing-function: ease-in-out;
}

.amp-footer-top {
    padding: 1rem;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
}

@media (min-width: 1024px) {
    .amp-footer-top {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
}

.amp-footer-bottom {
    display: flex;
    min-height: 60px;
    border-top: 1px solid hsl(var(--border));
}

.amp-footer-top-menu {
    display: flex;
    flex-direction: column;
}

@media (min-width: 768px) {
    .amp-footer-top-menu {
        flex-direction: row;
    }
}

.amp-footer-top-left-menu {
    margin-bottom: 1.5rem;
    width: 100%;
}

@media (min-width: 768px) {
    .amp-footer-top-left-menu {
        margin-bottom: 0;
        width: 41.66667
    }
}

@media (min-width: 1024px) {
    .amp-footer-top-left-menu {
        margin-right: 0.75rem;
    }
}

.amp-footer-top-right-menu {
    width: 100%;
}

@media (min-width: 768px) {
    .amp-footer-top-right-menu {
        width: 58.33333%;
    }
}

.amp-footer-top-left-menu ul {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
    padding: 0px;
}

.amp-footer-top-left-menu ul li {
    list-style: none;
    display: inline-flex;
    color: hsl(var(--foreground));
}

.amp-footer-top-left-menu ul li svg {
    margin-right: 0.5rem;
    height: 1.5rem;
    width: 1.5rem;
}

.amp-footer-copy {
    width: 100%;
    align-self: center;
    padding-left: 1rem;
}

`
export const basecolor = `:root {
    --background: 0 0% 100%;
    --foreground: 214 60% 16%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 47.4% 11.2%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --primary: 11 73% 55%;
    --primary-foreground: 13 100% 95%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --success: 141 76% 36%;
    --success-foreground: 143 76% 97%;
    --info: 199 89% 48%;
    --info-foreground: 200 100% 97%;
    --warning: 45 93% 47%;
    --warning-foreground: 46 92% 95%;
    --danger: 0 72% 51%;
    --danger-foreground: 0 86% 97%;
    --shop: 36.8 90.36% 51.18%;
    --news: 230.85deg 44.36% 73.92%;
    --news-foreground: 232.71deg 57.22% 36.67%;
    --tips: 186.29deg 70.47% 70.78%;
    --tips-foreground: 185.03deg 100% 28.04%;
    --gadget: 291.3deg 46.94% 71.18%;
    --gadget-foreground: 277.32deg 70.17% 35.49%;
    --game: 354deg 100% 90.2%;
    --game-foreground: 0deg 66.39% 46.67%;
    --main: 11 73% 55%;
    --ring: 215 20.2% 65.1%;
    --radius: 0.5rem
}

.dark-mode {
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;
    --muted: 223 47% 11%;
    --muted-foreground: 215.4 16.3% 56.9%;
    --popover: 224 71% 4%;
    --popover-foreground: 215 20.2% 65.1%;
    --card: 224 71% 4%;
    --card-foreground: 213 31% 91%;
    --border: 216 34% 17%;
    --input: 216 34% 17%;
    --primary: 13 100% 95%;
    --primary-foreground: 11 73% 55%;
    --secondary: 222.2 47.4% 11.2%;
    --secondary-foreground: 210 40% 98%;
    --accent: 216 34% 17%;
    --accent-foreground: 210 40% 98%;
    --success: 149 61% 20%;
    --success-foreground: 143 76% 97%;
    --info: 198 80% 24%;
    --info-foreground: 200 100% 97%;
    --warning: 28 74% 26%;
    --warning-foreground: 46 92% 95%;
    --danger: 0 63% 31%;
    --danger-foreground: 210 40% 98%;
    --shop: 36.8 90.36% 51.18%;
    --news: 230.85deg 44.36% 73.92%;
    --news-foreground: 232.71deg 57.22% 36.67%;
    --tips: 186.29deg 70.47% 70.78%;
    --tips-foreground: 185.03deg 100% 28.04%;
    --gadget: 291.3deg 46.94% 71.18%;
    --gadget-foreground: 277.32deg 70.17% 35.49%;
    --game: 354deg 100% 90.2%;
    --game-foreground: 0deg 66.39% 46.67%;
    --main: 11 73% 55%;
    --ring: 216 34% 17%;
    --radius: 0.5rem
}

`
