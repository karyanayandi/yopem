export const htmlStyle = `
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, segoe ui, helvetica neue, Arial, noto sans, sans-serif, apple color emoji, segoe ui emoji, segoe ui symbol, noto color emoji;
}

main {
  width: 100%;
  margin: 64px 0 0;
  overflow-x: hidden;
  transition-property: padding;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;
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
figure table th {
  position: relative;
  box-sizing: border-box;
  min-width: 1em;
  border-width: 2px;
  border-style: solid;
  border-color: var(--border);
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 3px;
  padding-bottom: 3px;
  vertical-align: top;
}

.amp-ad-content {
  margin-left: -16px;
  width: 100vw;
  margin-top: 8px;
  margin-bottom: 8px;
}

@media (min-width: 768px) {
  .amp-ad-content {
    margin-left: 0px;
    width: 100%;
  }
}

.amp-ad-header {
  margin: 64px auto 0;
}

.amp-header-container {
  position: fixed;
  top: 0;
  z-index: 999;
  margin: auto;
  display: flex;
  height: 4rem;
  width: 100%;
  max-width: 100%;
  align-items: center;
  background-color: hsl(var(--background));
  padding-left: 1rem;
  padding-right: 1rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.amp-logo {
  display: flex;
}

figure amp-img {
  max-width: 100%;
}

.amp-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.amp-share-container {
  display: flex;
  justify-content: space-between;
  margin-top: calc(1rem* calc(1 - 0));
  margin-bottom: calc(1rem* 0);
}

.amp-share-title {
  display: flex;
  align-items: center;
}

.amp-share-title span {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
}

.amp-share-button-container {
  display: flex;
  flex-direction: row;
}

#amp-dark-mode-wrapper {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

.amp-dark-mode-container {
  position: relative;
  display: flex;
  height: 1.75rem;
  width: 52px;
  align-items: center;
  border-radius: 9999px;
  background-color: hsl(var(--border));
  transition: all 200ms linear;
}

.amp-dark-mode-button {
  border: none;
  position: absolute;
  left: 0;
  margin-left: 2px;
  margin-right: 2px;
  display: flex;
  height: 1.5rem;
  width: 1.5rem;
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

.amp-topic-list {
  margin-top: calc(1rem* calc(1 - 0));
  margin-bottom: calc(1rem* 0);
}

.amp-topic-list a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-transform: uppercase;
  font-weight: 500;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  height: 2.25rem;
  border: 1px solid hsl(var(--input));
  border-radius: 9999px;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  justify-content: center;
  align-items: center;
}

.amp-share-button {
  display: flex;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  align-items: center;
  border-radius: var(--radius);
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 400;
}

.amp-share-list a:hover {
  background-color: hsl(var(--accent));
}

.amp-comment-action {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: calc(1rem* calc(1 - 0));
  margin-bottom: calc(1rem* 0);
}

.amp-comment-action a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  height: 2.25rem;
  border-radius: 9999px;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  background-color: hsl(var(--primary));
  color: hsl(var(--background));
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  justify-content: center;
  align-items: center;
}

.amp-topic-list a:hover {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.amp-author-container {
  display: flex;
  justify-content: space-between;
}

.amp-author {
  display: inline-flex;
  margin-left: 0.25rem;
  margin-bottom: 1rem;
}

.amp-author a {
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.amp-article-title {
  font-size: 1.5rem;
  line-height: 2rem;
}

@media (min-width: 768px) {
  .amp-article-title {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
}

@media (min-width: 1024px) {
  .amp-article-title {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
}

.amp-article-content {
  overflow-wrap: break-word;
}

.amp-article-content> :not([hidden])~ :not([hidden]) {
  margin-top: calc(1rem* calc(1 - 0));
  margin-bottom: calc(1rem* 0);
}

.amp-article-image amp-img {
  object-fit: cover;
  border-radius: .75rem;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  min-width: 100%;
}

.amp-article-content td,
.amp-article-content th {
  border-width: 1px;
  padding: .75rem;
}

@media (min-width: 768px) {
  .amp-article-content li {
    margin-left: 1rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}

.amp-article-content img {
  position: relative;
  height: auto;
  width: auto;
  border-radius: 1rem;
}

.amp-article-content .twitter-tweet.twitter-tweet-rendered {
  margin-left: auto;
  margin-right: auto;
}

.amp-article-content table th,
.amp-article-content table th {
  --tw-bg-opacity: 1;
  text-align: left;
  font-weight: 700;
}

.amp-article-content table {
  margin: 0;
  width: 100%;
  max-width: calc(100% - 10px);
  table-layout: fixed;
  border-collapse: collapse;
  overflow: hidden;
}

.amp-article-content pre {
  overflow-x: auto;
  padding: .75rem 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
}

.amp-article-content pre code {
  background-color: none;
  padding: 0;
  font-size: .8rem;
  color: inherit;
}

.amp-article-content mark {
  border-radius: .75rem;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: .125rem 0;
}

.amp-article-content h1,
.amp-article-content h2,
.amp-article-content h3,
.amp-article-content h4,
.amp-article-content h5,
.amp-article-content h6 {
  font-weight: 700;
}

.amp-article-content h1 {
  font-size: 1.5rem;
  line-height: 2rem;
}

@media (min-width: 768px) {
  .amp-article-content h1 {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
}

.amp-article-content h2 {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

@media (min-width: 768px) {
  .amp-article-content h2 {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
}

.amp-article-content h3 {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

@media (min-width: 768px) {
  .amp-article-content h3 {
    font-size: 1.5rem;
    line-height: 2rem;
  }
}

.amp-article-content h4 {
  font-size: 1rem;
  line-height: 1.5rem;

}

@media (min-width: 768px) {
  .amp-article-content h4 {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
}

.amp-article-content h5 {
  font-size: 1rem;
  line-height: 1.5rem;

}

@media (min-width: 768px) {
  .amp-article-content h4 {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}


.amp-article-content a {
  font-weight: 600;
  color: rgb(12 74 110);
  transition-duration: .2s;
  animation-duration: .2s;
}

.amp-article-content a:hover {
  color: rgb(8 47 73);
  text-decoration: underline;
}

.amp-article-content p {
  font-size: 1rem;
  line-height: 1.5rem;
}

@media (min-width: 768px) {
  .amp-article-content p {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}

.amp-article-content p:not(:last-child) {
  margin-bottom: 1.5rem;
}

.amp-article-content img {
  height: auto;
  max-height: 100%;
  max-width: 100%;
  border-radius: .75rem;
}

.amp-article-content ul {
  position: relative;
}

.amp-article-content ol li,
.amp-article-content ul li {
  margin-left: 3rem;
}

.amp-article-content ol li {
  list-style-type: decimal;
}

.amp-article-content ul li {
  list-style-type: disc;
}

.amp-article-content figure {
  margin: 1rem 0;
}

.amp-article-content iframe {
  position: relative;
  margin: 0 auto;
  aspect-ratio: 16/9;
  height: auto;
  width: 100%;
  border-radius: .75rem;
  vertical-align: baseline;
}

.amp-article-content hr {
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  color: hsl(var(--border));
}

.amp-article-content img {
  position: relative;
  height: auto;
  width: auto;
  border-radius: .75rem;
}

.amp-article-content .twitter-tweet.twitter-tweet-rendered {
  margin-left: auto;
  margin-right: auto;
}

a {
  text-decoration: none;
  color: hsl(var(--foreground));
}

.amp-article {
  padding: 0px 16px;
  max-width: 700px;
  margin: 0px auto;
}

.amp-article-image {
  margin: 0;
}

.amp-footer-container {
  position: sticky;
  z-index: 40;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  border-top-width: 1px;
  border-color: var(--border);
  text-align: center;
  top: 100vh;
}

.amp-footer-copy {
  font-weight: 700;
  margin: 1.5rem;
}
`
export const basecolor = `
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;

  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;

  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 3.9%;

  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;

  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;

  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;

  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;

  --danger: 0 84.2% 60.2%;
  --danger-foreground: 0 0% 98%;

  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 0 0% 3.9%;

  --radius: 0.5rem;
}

.dark-mode {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;

  --card: 0 0% 3.9%;
  --card-foreground: 0 0% 98%;

  --popover: 0 0% 3.9%;
  --popover-foreground: 0 0% 98%;

  --primary: 0 0% 98%;
  --primary-foreground: 0 0% 9%;

  --secondary: 0 0% 14.9%;
  --secondary-foreground: 0 0% 98%;

  --muted: 0 0% 14.9%;
  --muted-foreground: 0 0% 63.9%;

  --accent: 0 0% 14.9%;
  --accent-foreground: 0 0% 98%;

  --danger: 0 62.8% 30.6%;
  --danger-foreground: 0 0% 98%;

  --border: 0 0% 14.9%;
  --input: 0 0% 14.9%;
  --ring: 0 0% 83.1%;
}
`
