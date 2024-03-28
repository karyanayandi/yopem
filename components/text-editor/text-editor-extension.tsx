/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { Extension } from "@tiptap/core"
import {
  Blockquote,
  type BlockquoteOptions,
} from "@tiptap/extension-blockquote"
import { Bold, type BoldOptions } from "@tiptap/extension-bold"
import {
  BulletList,
  type BulletListOptions,
} from "@tiptap/extension-bullet-list"
import {
  CharacterCount,
  type CharacterCountOptions,
} from "@tiptap/extension-character-count"
import { CodeBlock, type CodeBlockOptions } from "@tiptap/extension-code-block"
import { Color } from "@tiptap/extension-color"
import { Document } from "@tiptap/extension-document"
import {
  Dropcursor,
  type DropcursorOptions,
} from "@tiptap/extension-dropcursor"
import Focus from "@tiptap/extension-focus"
import { Gapcursor } from "@tiptap/extension-gapcursor"
import { HardBreak, type HardBreakOptions } from "@tiptap/extension-hard-break"
import { Heading, type HeadingOptions } from "@tiptap/extension-heading"
import Highlight from "@tiptap/extension-highlight"
import { History, type HistoryOptions } from "@tiptap/extension-history"
import {
  HorizontalRule,
  type HorizontalRuleOptions,
} from "@tiptap/extension-horizontal-rule"
import { Image, type ImageOptions } from "@tiptap/extension-image"
import { Italic, type ItalicOptions } from "@tiptap/extension-italic"
import { Link, type LinkOptions } from "@tiptap/extension-link"
import { ListItem, type ListItemOptions } from "@tiptap/extension-list-item"
import {
  OrderedList,
  type OrderedListOptions,
} from "@tiptap/extension-ordered-list"
import { Paragraph, type ParagraphOptions } from "@tiptap/extension-paragraph"
import {
  Placeholder,
  type PlaceholderOptions,
} from "@tiptap/extension-placeholder"
import { Strike, type StrikeOptions } from "@tiptap/extension-strike"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import { Text } from "@tiptap/extension-text"
import TextStyle from "@tiptap/extension-text-style"
import { Underline, type UnderlineOptions } from "@tiptap/extension-underline"
import { Youtube, type YoutubeOptions } from "@tiptap/extension-youtube"

import { TextEditorButton } from "./text-editor-button"
import { TextEditorCommandMenu } from "./text-editor-command-menu"
import { TextEditorFacebookEmbed } from "./text-editor-facebook-embed"
import { TextEditorXEmbed } from "./text-editor-x-embed"

export interface TextEditorExtensionOptions {
  blockquote: Partial<BlockquoteOptions> | false
  bold: Partial<BoldOptions> | false
  bulletList: Partial<BulletListOptions> | false
  characterCount: Partial<CharacterCountOptions> | false
  codeBlock: Partial<CodeBlockOptions> | false
  document: false
  dropcursor: Partial<DropcursorOptions> | false
  gapcursor: false
  hardBreak: Partial<HardBreakOptions> | false
  heading: Partial<HeadingOptions> | false
  history: Partial<HistoryOptions> | false
  horizontalRule: Partial<HorizontalRuleOptions> | false
  image: Partial<ImageOptions> | false
  italic: Partial<ItalicOptions> | false
  link: Partial<LinkOptions> | false
  listItem: Partial<ListItemOptions> | false
  orderedList: Partial<OrderedListOptions> | false
  paragraph: Partial<ParagraphOptions> | false
  placeholder: Partial<PlaceholderOptions> | false
  strike: Partial<StrikeOptions> | false
  text: false
  underline: Partial<UnderlineOptions> | false
  youtube: Partial<YoutubeOptions> | false
}

export const TextEditorExtension = Extension.create<TextEditorExtensionOptions>(
  {
    name: "TextEditorExtension",

    addExtensions() {
      const extensions: any[] = []

      if (this.options.blockquote !== false) {
        extensions.push(Blockquote.configure(this.options?.blockquote))
      }

      if (this.options.bold !== false) {
        extensions.push(Bold.configure(this.options?.bold))
      }

      if (this.options.codeBlock !== false) {
        extensions.push(CodeBlock.configure(this.options?.codeBlock))
      }

      if (this.options.bulletList !== false) {
        extensions.push(BulletList.configure(this.options?.bulletList))
      }

      if (this.options.characterCount !== false) {
        extensions.push(CharacterCount.configure(this.options?.characterCount))
      }

      if (this.options.document !== false) {
        extensions.push(Document.configure(this.options?.document))
      }

      if (this.options.dropcursor !== false) {
        extensions.push(Dropcursor.configure(this.options?.dropcursor))
      }

      if (this.options.gapcursor !== false) {
        extensions.push(Gapcursor.configure(this.options?.gapcursor))
      }

      if (this.options.hardBreak !== false) {
        extensions.push(HardBreak.configure(this.options?.hardBreak))
      }

      if (this.options.heading !== false) {
        extensions.push(Heading.configure(this.options?.heading))
      }

      if (this.options.history !== false) {
        extensions.push(History.configure(this.options?.history))
      }

      if (this.options.horizontalRule !== false) {
        extensions.push(HorizontalRule.configure(this.options?.horizontalRule))
      }

      if (this.options.image !== false) {
        extensions.push(Image.configure(this.options?.image))
      }

      if (this.options.italic !== false) {
        extensions.push(Italic.configure(this.options?.italic))
      }

      if (this.options.link !== false) {
        extensions.push(
          Link.configure({
            openOnClick: false,
            HTMLAttributes: {
              rel: "noopener noreferrer",
              target: "_blank",
            },
          }),
        )
      }

      if (this.options.listItem !== false) {
        extensions.push(ListItem.configure(this.options?.listItem))
      }

      if (this.options.orderedList !== false) {
        extensions.push(OrderedList.configure(this.options?.orderedList))
      }

      if (this.options.paragraph !== false) {
        extensions.push(Paragraph.configure(this.options?.paragraph))
      }

      if (this.options.placeholder !== false) {
        extensions.push(
          Placeholder.configure({
            placeholder: "Press '/' for commands",
          }),
        )
      }

      if (this.options.strike !== false) {
        extensions.push(Strike.configure(this.options?.strike))
      }

      if (this.options.text !== false) {
        extensions.push(Text.configure(this.options?.text))
      }

      if (this.options.underline !== false) {
        extensions.push(Underline.configure(this.options?.underline))
      }

      if (this.options.youtube !== false) {
        extensions.push(Youtube.configure(this.options?.youtube))
      }

      extensions.push(TextEditorCommandMenu)
      extensions.push(
        Table.configure({
          resizable: true,
        }),
      )
      extensions.push(TableRow)
      extensions.push(TableHeader)
      extensions.push(TableCell)
      extensions.push(TextEditorButton)
      extensions.push(TextEditorXEmbed)
      extensions.push(
        Focus.configure({
          className: "has-focus",
          mode: "shallowest",
        }),
      )
      extensions.push(TextEditorFacebookEmbed)
      extensions.push(Color)
      extensions.push(TextStyle)
      extensions.push(
        Highlight.configure({
          multicolor: true,
        }),
      )

      return extensions
    },
  },
)
