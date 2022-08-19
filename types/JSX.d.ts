// Type definitions for Nullstack
// Project: http://github.com/nullstack/nullstack/
// Definitions by: Asana <https://asana.com>
//                 AssureSign <http://www.assuresign.com>
//                 Microsoft <https://microsoft.com>
//                 John Reilly <https://github.com/johnnyreilly>
//                 Benoit Benezech <https://github.com/bbenezech>
//                 Patricio Zavolinsky <https://github.com/pzavolinsky>
//                 Eric Anderson <https://github.com/ericanderson>
//                 Dovydas Navickas <https://github.com/DovydasNavickas>
//                 Josh Rutherford <https://github.com/theruther4d>
//                 Guilherme Hübner <https://github.com/guilhermehubner>
//                 Ferdy Budhidharma <https://github.com/ferdaber>
//                 Johann Rakotoharisoa <https://github.com/jrakotoharisoa>
//                 Olivier Pascal <https://github.com/pascaloliv>
//                 Martin Hochel <https://github.com/hotell>
//                 Frank Li <https://github.com/franklixuefei>
//                 Jessica Franco <https://github.com/Jessidhia>
//                 Saransh Kataria <https://github.com/saranshkataria>
//                 Kanitkorn Sujautra <https://github.com/lukyth>
//                 Sebastian Silbermann <https://github.com/eps1lon>
//                 Kyle Scully <https://github.com/zieka>
//                 Cong Zhang <https://github.com/dancerphil>
//                 Dimitri Mitropoulos <https://github.com/dimitropoulos>
//                 JongChan Choi <https://github.com/disjukr>
//                 Victor Magalhães <https://github.com/vhfmag>
//                 Dale Tan <https://github.com/hellatan>
//                 Priyanshu Rav <https://github.com/priyanshurav>
//                 Guilherme Correia <https://github.com/GuiDevloper>
// TypeScript Version: 2.8

import { NullstackClientContext } from ".";

type NativeDragEvent = globalThis.DragEvent;
type NativeFocusEvent = globalThis.FocusEvent;
type NativeKeyboardEvent = globalThis.KeyboardEvent;
type NativeMouseEvent = globalThis.MouseEvent;
type NativePointerEvent = globalThis.PointerEvent;
type NativeUIEvent = globalThis.UIEvent;
type NativeWheelEvent = globalThis.WheelEvent;
type Booleanish = boolean | "true" | "false";

//
// Nullstack Elements
// ----------------------------------------------------------------------

export interface Attributes {
  html?: string | undefined;
  source?: object | undefined;
  bind?: any | undefined;
  data?: object | undefined;
  "data-"?: any;
  [key: string]: any;
}

export interface NullstackAttributes extends Attributes {
  children?: NullstackNode;
  route?: string | undefined;
  persistent?: boolean | undefined;
  key?: string;
}

export interface ClassAttributes extends Attributes {}

//
// Factories
// ----------------------------------------------------------------------

type DetailedHTMLFactory<P, T = any> = P;

export interface SVGFactory {}

export type NullstackFragment = NullstackNode[];
export type NullstackNode =
  | NullstackFragment
  | string
  | number
  | boolean
  | null
  | undefined;

//
// Event System
// ----------------------------------------------------------------------
// TODO: change any to unknown when moving to TS v3
export interface BaseSyntheticEvent<E = object, C = any, T = any> {
  nativeEvent: E;
  currentTarget: C;
  target: T;
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  preventDefault(): void;
  isDefaultPrevented(): boolean;
  stopPropagation(): void;
  timeStamp: number;
  type: string;
}

/**
 * currentTarget - a reference to the element on which the event listener is registered.
 *
 * target - a reference to the element from which the event was originally dispatched.
 * This might be a child element to the element on which the event listener is registered.
 * If you thought this should be `EventTarget & T`, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508#issuecomment-256045682
 */
export interface SyntheticEvent<T = Element, E = Event>
  extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}

export interface DragEvent<T = Element> extends MouseEvent<T, NativeDragEvent> {
  dataTransfer: DataTransfer;
}

export interface PointerEvent<T = Element>
  extends MouseEvent<T, NativePointerEvent> {
  pointerId: number;
  pressure: number;
  tangentialPressure: number;
  tiltX: number;
  tiltY: number;
  twist: number;
  width: number;
  height: number;
  pointerType: "mouse" | "pen" | "touch";
  isPrimary: boolean;
}

export interface FocusEvent<Target = Element, RelatedTarget = Element>
  extends SyntheticEvent<Target, NativeFocusEvent> {
  relatedTarget: (EventTarget & RelatedTarget) | null;
  target: EventTarget & Target;
}

export interface FormEvent<T = Element> extends SyntheticEvent<T> {}

export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T;
}

export interface KeyboardEvent<T = Element>
  extends UIEvent<T, NativeKeyboardEvent> {
  altKey: boolean;
  /** @deprecated */
  charCode: number;
  ctrlKey: boolean;
  code: string;
  /**
   * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
   */
  getModifierState(key: string): boolean;
  /**
   * See the [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values). for possible values
   */
  key: string;
  /** @deprecated */
  keyCode: number;
  location: number;
  metaKey: boolean;
  repeat: boolean;
  shiftKey: boolean;
  /** @deprecated */
  which: number;
}

export interface MouseEvent<T = Element, E = NativeMouseEvent>
  extends UIEvent<T, E> {
  altKey: boolean;
  button: number;
  buttons: number;
  clientX: number;
  clientY: number;
  ctrlKey: boolean;
  /**
   * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
   */
  getModifierState(key: string): boolean;
  metaKey: boolean;
  movementX: number;
  movementY: number;
  pageX: number;
  pageY: number;
  relatedTarget: EventTarget | null;
  screenX: number;
  screenY: number;
  shiftKey: boolean;
}

export interface UIEvent<T = Element, E = NativeUIEvent>
  extends SyntheticEvent<T, E> {
  detail: number;
}

export interface WheelEvent<T = Element>
  extends MouseEvent<T, NativeWheelEvent> {
  deltaMode: number;
  deltaX: number;
  deltaY: number;
  deltaZ: number;
}

//
// Event Handler Types
// ----------------------------------------------------------------------

type EventHandler<E extends SyntheticEvent<any>> =
  | object
  | {
      bivarianceHack(event: { event: E } & NullstackClientContext): void;
    }["bivarianceHack"];

type NullstackEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;

//
// Props / DOM Attributes
// ----------------------------------------------------------------------

type DetailedHTMLProps<E extends HTMLAttributes<T>, T> = E;

export interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes {}

export interface DOMAttributes<T> extends Attributes {
  // Focus Events
  onfocus?: FocusEventHandler<T> | undefined;
  onblur?: FocusEventHandler<T> | undefined;

  // Form Events
  onchange?: FormEventHandler<T> | undefined;
  oninput?: FormEventHandler<T> | undefined;
  onreset?: FormEventHandler<T> | undefined;
  onsubmit?: FormEventHandler<T> | undefined;
  oninvalid?: FormEventHandler<T> | undefined;

  // Image Events
  onload?: NullstackEventHandler<T> | undefined;
  onerror?: NullstackEventHandler<T> | undefined; // also a Media Event

  // Keyboard Events
  onkeydown?: KeyboardEventHandler<T> | undefined;
  /** @deprecated */
  onkeypress?: KeyboardEventHandler<T> | undefined;
  onkeyup?: KeyboardEventHandler<T> | undefined;

  // Media Events
  onabort?: NullstackEventHandler<T> | undefined;
  oncanplay?: NullstackEventHandler<T> | undefined;
  oncanplaythrough?: NullstackEventHandler<T> | undefined;
  ondurationchange?: NullstackEventHandler<T> | undefined;
  onemptied?: NullstackEventHandler<T> | undefined;
  onended?: NullstackEventHandler<T> | undefined;
  onloadeddata?: NullstackEventHandler<T> | undefined;
  onloadedmetadata?: NullstackEventHandler<T> | undefined;
  onloadstart?: NullstackEventHandler<T> | undefined;
  onpause?: NullstackEventHandler<T> | undefined;
  onplay?: NullstackEventHandler<T> | undefined;
  onplaying?: NullstackEventHandler<T> | undefined;
  onprogress?: NullstackEventHandler<T> | undefined;
  onratechange?: NullstackEventHandler<T> | undefined;
  onseeked?: NullstackEventHandler<T> | undefined;
  onseeking?: NullstackEventHandler<T> | undefined;
  onstalled?: NullstackEventHandler<T> | undefined;
  onsuspend?: NullstackEventHandler<T> | undefined;
  ontimeupdate?: NullstackEventHandler<T> | undefined;
  onvolumechange?: NullstackEventHandler<T> | undefined;
  onwaiting?: NullstackEventHandler<T> | undefined;

  // MouseEvents
  onclick?: MouseEventHandler<T> | undefined;
  oncontextmenu?: MouseEventHandler<T> | undefined;
  ondblclick?: MouseEventHandler<T> | undefined;
  ondrag?: DragEventHandler<T> | undefined;
  ondragend?: DragEventHandler<T> | undefined;
  ondragenter?: DragEventHandler<T> | undefined;
  ondragleave?: DragEventHandler<T> | undefined;
  ondragover?: DragEventHandler<T> | undefined;
  ondragstart?: DragEventHandler<T> | undefined;
  ondrop?: DragEventHandler<T> | undefined;
  onmousedown?: MouseEventHandler<T> | undefined;
  onmouseenter?: MouseEventHandler<T> | undefined;
  onmouseleave?: MouseEventHandler<T> | undefined;
  onmousemove?: MouseEventHandler<T> | undefined;
  onmouseout?: MouseEventHandler<T> | undefined;
  onmouseover?: MouseEventHandler<T> | undefined;
  onmouseup?: MouseEventHandler<T> | undefined;

  // Wheel Events
  /** @deprecated */
  onmousewheel?: WheelEventHandler<T> | undefined;

  // Selection Events
  onselect?: NullstackEventHandler<T> | undefined;

  // Pointer Events
  onpointerdown?: PointerEventHandler<T> | undefined;
  onpointermove?: PointerEventHandler<T> | undefined;
  onpointerup?: PointerEventHandler<T> | undefined;
  onpointercancel?: PointerEventHandler<T> | undefined;
  onpointerenter?: PointerEventHandler<T> | undefined;
  onpointerleave?: PointerEventHandler<T> | undefined;
  onpointerover?: PointerEventHandler<T> | undefined;
  onpointerout?: PointerEventHandler<T> | undefined;

  // UI Events
  onscroll?: UIEventHandler<T> | undefined;
}

// All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
export interface AriaAttributes {
  /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or applicatio */
  "aria-activedescendant"?: string | undefined;
  /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
  "aria-atomic"?: Booleanish | undefined;
  /**
   * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
   * presented if they are made.
   */
  "aria-autocomplete"?: "none" | "inline" | "list" | "both" | undefined;
  /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
  "aria-busy"?: Booleanish | undefined;
  /**
   * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
   * @see aria-pressed @see aria-selected.
   */
  "aria-checked"?: boolean | "false" | "mixed" | "true" | undefined;
  /**
   * Defines the total number of columns in a table, grid, or treegrid.
   * @see aria-colindex.
   */
  "aria-colcount"?: number | undefined;
  /**
   * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
   * @see aria-colcount @see aria-colspa
   */
  "aria-colindex"?: number | undefined;
  /**
   * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
   * @see aria-colindex @see aria-rowspa
   */
  "aria-colspan"?: number | undefined;
  /**
   * Identifies the element (or elements) whose contents or presence are controlled by the current element.
   * @see aria-owns.
   */
  "aria-controls"?: string | undefined;
  /** Indicates the element that represents the current item within a container or set of related elements. */
  "aria-current"?:
    | boolean
    | "false"
    | "true"
    | "page"
    | "step"
    | "location"
    | "date"
    | "time"
    | undefined;
  /**
   * Identifies the element (or elements) that describes the object.
   * @see aria-labelledby
   */
  "aria-describedby"?: string | undefined;
  /**
   * Identifies the element that provides a detailed, extended description for the object.
   * @see aria-describedby.
   */
  "aria-details"?: string | undefined;
  /**
   * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
   * @see aria-hidden @see aria-readonly.
   */
  "aria-disabled"?: Booleanish | undefined;
  /**
   * Indicates what functions can be performed when a dragged object is released on the drop target.
   * @deprecated in ARIA 1.1
   */
  "aria-dropeffect"?:
    | "none"
    | "copy"
    | "execute"
    | "link"
    | "move"
    | "popup"
    | undefined;
  /**
   * Identifies the element that provides an error message for the object.
   * @see aria-invalid @see aria-describedby.
   */
  "aria-errormessage"?: string | undefined;
  /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
  "aria-expanded"?: Booleanish | undefined;
  /**
   * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
   * allows assistive technology to override the general default of reading in document source order.
   */
  "aria-flowto"?: string | undefined;
  /**
   * Indicates an element's "grabbed" state in a drag-and-drop operatio
   * @deprecated in ARIA 1.1
   */
  "aria-grabbed"?: Booleanish | undefined;
  /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
  "aria-haspopup"?:
    | boolean
    | "false"
    | "true"
    | "menu"
    | "listbox"
    | "tree"
    | "grid"
    | "dialog"
    | undefined;
  /**
   * Indicates whether the element is exposed to an accessibility API.
   * @see aria-disabled.
   */
  "aria-hidden"?: Booleanish | undefined;
  /**
   * Indicates the entered value does not conform to the format expected by the applicatio
   * @see aria-errormessage.
   */
  "aria-invalid"?:
    | boolean
    | "false"
    | "true"
    | "grammar"
    | "spelling"
    | undefined;
  /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
  "aria-keyshortcuts"?: string | undefined;
  /**
   * Defines a string value that labels the current element.
   * @see aria-labelledby.
   */
  "aria-label"?: string | undefined;
  /**
   * Identifies the element (or elements) that labels the current element.
   * @see aria-describedby.
   */
  "aria-labelledby"?: string | undefined;
  /** Defines the hierarchical level of an element within a structure. */
  "aria-level"?: number | undefined;
  /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live regio */
  "aria-live"?: "off" | "assertive" | "polite" | undefined;
  /** Indicates whether an element is modal when displayed. */
  "aria-modal"?: Booleanish | undefined;
  /** Indicates whether a text box accepts multiple lines of input or only a single line. */
  "aria-multiline"?: Booleanish | undefined;
  /** Indicates that the user may select more than one item from the current selectable descendants. */
  "aria-multiselectable"?: Booleanish | undefined;
  /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
  "aria-orientation"?: "horizontal" | "vertical" | undefined;
  /**
   * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
   * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
   * @see aria-controls.
   */
  "aria-owns"?: string | undefined;
  /**
   * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
   * A hint could be a sample value or a brief description of the expected format.
   */
  "aria-placeholder"?: string | undefined;
  /**
   * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
   * @see aria-setsize.
   */
  "aria-posinset"?: number | undefined;
  /**
   * Indicates the current "pressed" state of toggle buttons.
   * @see aria-checked @see aria-selected.
   */
  "aria-pressed"?: boolean | "false" | "mixed" | "true" | undefined;
  /**
   * Indicates that the element is not editable, but is otherwise operable.
   * @see aria-disabled.
   */
  "aria-readonly"?: Booleanish | undefined;
  /**
   * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
   * @see aria-atomic.
   */
  "aria-relevant"?:
    | "additions"
    | "additions removals"
    | "additions text"
    | "all"
    | "removals"
    | "removals additions"
    | "removals text"
    | "text"
    | "text additions"
    | "text removals"
    | undefined;
  /** Indicates that user input is required on the element before a form may be submitted. */
  "aria-required"?: Booleanish | undefined;
  /** Defines a human-readable, author-localized description for the role of an element. */
  "aria-roledescription"?: string | undefined;
  /**
   * Defines the total number of rows in a table, grid, or treegrid.
   * @see aria-rowindex.
   */
  "aria-rowcount"?: number | undefined;
  /**
   * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
   * @see aria-rowcount @see aria-rowspa
   */
  "aria-rowindex"?: number | undefined;
  /**
   * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
   * @see aria-rowindex @see aria-colspa
   */
  "aria-rowspan"?: number | undefined;
  /**
   * Indicates the current "selected" state of various widgets.
   * @see aria-checked @see aria-pressed.
   */
  "aria-selected"?: Booleanish | undefined;
  /**
   * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
   * @see aria-posinset.
   */
  "aria-setsize"?: number | undefined;
  /** Indicates if items in a table or grid are sorted in ascending or descending order. */
  "aria-sort"?: "none" | "ascending" | "descending" | "other" | undefined;
  /** Defines the maximum allowed value for a range widget. */
  "aria-valuemax"?: number | undefined;
  /** Defines the minimum allowed value for a range widget. */
  "aria-valuemin"?: number | undefined;
  /**
   * Defines the current value for a range widget.
   * @see aria-valuetext.
   */
  "aria-valuenow"?: number | undefined;
  /** Defines the human readable text alternative of aria-valuenow for a range widget. */
  "aria-valuetext"?: string | undefined;
}

// All the WAI-ARIA 1.1 role attribute values from https://www.w3.org/TR/wai-aria-1.1/#role_definitions
type AriaRole =
  | "alert"
  | "alertdialog"
  | "application"
  | "article"
  | "banner"
  | "button"
  | "cell"
  | "checkbox"
  | "columnheader"
  | "combobox"
  | "complementary"
  | "contentinfo"
  | "definition"
  | "dialog"
  | "directory"
  | "document"
  | "feed"
  | "figure"
  | "form"
  | "grid"
  | "gridcell"
  | "group"
  | "heading"
  | "img"
  | "link"
  | "list"
  | "listbox"
  | "listitem"
  | "log"
  | "main"
  | "marquee"
  | "math"
  | "menu"
  | "menubar"
  | "menuitem"
  | "menuitemcheckbox"
  | "menuitemradio"
  | "navigation"
  | "none"
  | "note"
  | "option"
  | "presentation"
  | "progressbar"
  | "radio"
  | "radiogroup"
  | "region"
  | "row"
  | "rowgroup"
  | "rowheader"
  | "scrollbar"
  | "search"
  | "searchbox"
  | "separator"
  | "slider"
  | "spinbutton"
  | "status"
  | "switch"
  | "tab"
  | "table"
  | "tablist"
  | "tabpanel"
  | "term"
  | "textbox"
  | "timer"
  | "toolbar"
  | "tooltip"
  | "tree"
  | "treegrid"
  | "treeitem"
  | (string & {});

export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
  // Standard HTML Attributes
  accesskey?: string | undefined;
  class?: string | undefined;
  contenteditable?: Booleanish | "inherit" | undefined;
  contextmenu?: string | undefined;
  dir?: string | undefined;
  draggable?: Booleanish | undefined;
  hidden?: boolean | undefined;
  id?: string | undefined;
  lang?: string | undefined;
  placeholder?: string | undefined;
  slot?: string | undefined;
  spellcheck?: Booleanish | undefined;
  style?: string | undefined;
  tabindex?: number | string | undefined;
  title?: string | undefined;
  translate?: "yes" | "no" | undefined;

  // WAI-ARIA
  role?: AriaRole | undefined;

  // Non-standard Attributes
  autocapitalize?: string | undefined;
  itemprop?: string | undefined;
  itemscope?: boolean | undefined;
  itemtype?: string | undefined;
  itemid?: string | undefined;
  itemref?: string | undefined;

  // Living Standard
  /**
   * Hints at the type of data that might be entered by the user while editing the element or its contents
   * @see https://html.spec.whatwg.org/multipage/interactiohtml#input-modalities:-the-inputmode-attribute
   */
  inputmode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search"
    | undefined;
  /**
   * Specify that a standard HTML element should behave like a defined custom built-in element
   * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
   */
  is?: string | undefined;
}

export interface AllHTMLAttributes<T> extends HTMLAttributes<T> {
  // Standard HTML Attributes
  accept?: string | undefined;
  "accept-charset"?: string | undefined;
  action?: string | undefined;
  allowfullScreen?: boolean | undefined;
  allowTransparency?: boolean | undefined;
  alt?: string | undefined;
  as?: string | undefined;
  async?: boolean | undefined;
  autocomplete?: string | undefined;
  autofocus?: boolean | undefined;
  autoplay?: boolean | undefined;
  capture?: boolean | "user" | "environment" | undefined;
  charset?: string | undefined;
  checked?: boolean | undefined;
  cite?: string | undefined;
  classid?: string | undefined;
  cols?: number | undefined;
  colspan?: number | undefined;
  content?: string | undefined;
  controls?: boolean | undefined;
  coords?: string | undefined;
  crossorigin?: "anonymous" | "use-credentials" | "" | undefined;
  datetime?: string | undefined;
  default?: boolean | undefined;
  defer?: boolean | undefined;
  disabled?: boolean | undefined;
  download?: any;
  enctype?: string | undefined;
  form?: string | undefined;
  formaction?: string | undefined;
  formenctype?: string | undefined;
  formmethod?: string | undefined;
  formnovalidate?: boolean | undefined;
  formtarget?: string | undefined;
  headers?: string | undefined;
  height?: number | string | undefined;
  high?: number | undefined;
  href?: string | undefined;
  hreflang?: string | undefined;
  "http-equiv"?: string | undefined;
  integrity?: string | undefined;
  kind?: string | undefined;
  label?: string | undefined;
  list?: string | undefined;
  loop?: boolean | undefined;
  low?: number | undefined;
  manifest?: string | undefined;
  max?: number | string | undefined;
  maxlength?: number | undefined;
  media?: string | undefined;
  mediagroup?: string | undefined;
  method?: string | undefined;
  min?: number | string | undefined;
  minlength?: number | undefined;
  multiple?: boolean | undefined;
  muted?: boolean | undefined;
  name?: string | undefined;
  nonce?: string | undefined;
  novalidate?: boolean | undefined;
  open?: boolean | undefined;
  optimum?: number | undefined;
  pattern?: string | undefined;
  placeholder?: string | undefined;
  playsinline?: boolean | undefined;
  poster?: string | undefined;
  preload?: string | undefined;
  readonly?: boolean | undefined;
  rel?: string | undefined;
  required?: boolean | undefined;
  reversed?: boolean | undefined;
  rows?: number | undefined;
  rowspan?: number | undefined;
  sandbox?: string | undefined;
  scope?: string | undefined;
  scoped?: boolean | undefined;
  seamless?: boolean | undefined;
  selected?: boolean | undefined;
  shape?: string | undefined;
  size?: number | undefined;
  sizes?: string | undefined;
  span?: number | undefined;
  src?: string | undefined;
  srcdoc?: string | undefined;
  srclang?: string | undefined;
  srcset?: string | undefined;
  start?: number | undefined;
  step?: number | string | undefined;
  summary?: string | undefined;
  target?: string | undefined;
  type?: string | undefined;
  usemap?: string | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
  width?: number | string | undefined;
  wrap?: string | undefined;
}

type HTMLAttributeReferrerPolicy =
  | ""
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url";

type HTMLAttributeAnchorTarget =
  | "_self"
  | "_blank"
  | "_parent"
  | "_top"
  | (string & {});

export interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
  download?: any;
  href?: string | undefined;
  hreflang?: string | undefined;
  media?: string | undefined;
  ping?: string | undefined;
  rel?: string | undefined;
  target?: HTMLAttributeAnchorTarget | undefined;
  type?: string | undefined;
  referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;

  // Nullstack Router
  params?: object | undefined;
  path?: string | undefined;
}

export interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

export interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
  alt?: string | undefined;
  coords?: string | undefined;
  download?: any;
  href?: string | undefined;
  hreflang?: string | undefined;
  media?: string | undefined;
  referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
  rel?: string | undefined;
  shape?: string | undefined;
  target?: string | undefined;
}

export interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
  href?: string | undefined;
  target?: string | undefined;
}

export interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
  cite?: string | undefined;
}

export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
  autofocus?: boolean | undefined;
  disabled?: boolean | undefined;
  form?: string | undefined;
  formaction?: string | undefined;
  formenctype?: string | undefined;
  formmethod?: string | undefined;
  formnovalidate?: boolean | undefined;
  formtarget?: string | undefined;
  name?: string | undefined;
  type?: "submit" | "reset" | "button" | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
}

export interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
  height?: number | string | undefined;
  width?: number | string | undefined;
}

export interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
  span?: number | undefined;
  /** @deprecated */
  width?: number | string | undefined;
}

export interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
  span?: number | undefined;
}

export interface DataHTMLAttributes<T> extends HTMLAttributes<T> {
  value?: string | ReadonlyArray<string> | number | undefined;
}

export interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
  open?: boolean | undefined;
}

export interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
  cite?: string | undefined;
  datetime?: string | undefined;
}

export interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
  open?: boolean | undefined;
}

export interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
  height?: number | string | undefined;
  src?: string | undefined;
  type?: string | undefined;
  width?: number | string | undefined;
}

export interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
  disabled?: boolean | undefined;
  form?: string | undefined;
  name?: string | undefined;
}

export interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
  "accept-charset"?: string | undefined;
  action?: string | undefined;
  autocomplete?: string | undefined;
  enctype?: string | undefined;
  method?: string | undefined;
  name?: string | undefined;
  novalidate?: boolean | undefined;
  target?: string | undefined;
}

export interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
  manifest?: string | undefined;
}

export interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
  allow?: string | undefined;
  allowfullScreen?: boolean | undefined;
  allowTransparency?: boolean | undefined;
  /** @deprecated */
  frameBorder?: number | string | undefined;
  height?: number | string | undefined;
  loading?: "eager" | "lazy" | undefined;
  /** @deprecated */
  marginHeight?: number | undefined;
  /** @deprecated */
  marginWidth?: number | undefined;
  name?: string | undefined;
  referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
  sandbox?: string | undefined;
  /** @deprecated */
  scrolling?: string | undefined;
  seamless?: boolean | undefined;
  src?: string | undefined;
  srcdoc?: string | undefined;
  width?: number | string | undefined;
}

export interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
  alt?: string | undefined;
  crossorigin?: "anonymous" | "use-credentials" | "" | undefined;
  decoding?: "async" | "auto" | "sync" | undefined;
  height?: number | string | undefined;
  loading?: "eager" | "lazy" | undefined;
  referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
  sizes?: string | undefined;
  src?: string | undefined;
  srcset?: string | undefined;
  usemap?: string | undefined;
  width?: number | string | undefined;
}

export interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
  cite?: string | undefined;
  datetime?: string | undefined;
}

type HTMLInputTypeAttribute =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week"
  | (string & {});

export interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
  accept?: string | undefined;
  alt?: string | undefined;
  autocomplete?: string | undefined;
  autofocus?: boolean | undefined;
  /** @see https://www.w3.org/TR/html-media-capture/#the-capture-attribute */
  capture?: boolean | "user" | "environment" | undefined;
  checked?: boolean | undefined;
  disabled?: boolean | undefined;
  enterkeyhint?:
    | "enter"
    | "done"
    | "go"
    | "next"
    | "previous"
    | "search"
    | "send"
    | undefined;
  form?: string | undefined;
  formaction?: string | undefined;
  formenctype?: string | undefined;
  formmethod?: string | undefined;
  formnovalidate?: boolean | undefined;
  formtarget?: string | undefined;
  height?: number | string | undefined;
  list?: string | undefined;
  max?: number | string | undefined;
  maxlength?: number | undefined;
  min?: number | string | undefined;
  minlength?: number | undefined;
  multiple?: boolean | undefined;
  name?: string | undefined;
  pattern?: string | undefined;
  placeholder?: string | undefined;
  readonly?: boolean | undefined;
  required?: boolean | undefined;
  size?: number | undefined;
  src?: string | undefined;
  step?: number | string | undefined;
  type?: HTMLInputTypeAttribute | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
  width?: number | string | undefined;

  onchange?: ChangeEventHandler<T> | undefined;
}

export interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
  autofocus?: boolean | undefined;
  challenge?: string | undefined;
  disabled?: boolean | undefined;
  form?: string | undefined;
  keytype?: string | undefined;
  keyparams?: string | undefined;
  name?: string | undefined;
}

export interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
  form?: string | undefined;
}

export interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
  value?: string | ReadonlyArray<string> | number | undefined;
}

export interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
  as?: string | undefined;
  crossorigin?: true | "anonymous" | "use-credentials" | "" | undefined;
  href?: string | undefined;
  hreflang?: string | undefined;
  integrity?: string | undefined;
  media?: string | undefined;
  referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
  rel?: string | undefined;
  sizes?: string | undefined;
  type?: string | undefined;
  charset?: string | undefined;
}

export interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
  name?: string | undefined;
}

export interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
  type?: string | undefined;
}

export interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
  autoplay?: boolean | undefined;
  controls?: boolean | undefined;
  crossorigin?: true | "anonymous" | "use-credentials" | "" | undefined;
  loop?: boolean | undefined;
  mediagroup?: string | undefined;
  muted?: boolean | undefined;
  playsinline?: boolean | undefined;
  preload?: string | undefined;
  src?: string | undefined;
}

export interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
  charset?: string | undefined;
  content?: string | undefined;
  "http-equiv"?: string | undefined;
  name?: string | undefined;
  media?: string | undefined;
}

export interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
  form?: string | undefined;
  high?: number | undefined;
  low?: number | undefined;
  max?: number | string | undefined;
  min?: number | string | undefined;
  optimum?: number | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
}

export interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
  cite?: string | undefined;
}

export interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
  classid?: string | undefined;
  form?: string | undefined;
  height?: number | string | undefined;
  name?: string | undefined;
  type?: string | undefined;
  usemap?: string | undefined;
  width?: number | string | undefined;
}

export interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
  reversed?: boolean | undefined;
  start?: number | undefined;
  type?: "1" | "a" | "A" | "i" | "I" | undefined;
}

export interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
  disabled?: boolean | undefined;
  label?: string | undefined;
}

export interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
  disabled?: boolean | undefined;
  label?: string | undefined;
  selected?: boolean | undefined;
  value?: string | ReadonlyArray<string> | number | boolean | undefined;
}

export interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
  form?: string | undefined;
  name?: string | undefined;
}

export interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
  name?: string | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
}

export interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
  max?: number | string | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
}

export interface SlotHTMLAttributes<T> extends HTMLAttributes<T> {
  name?: string | undefined;
}

export interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
  async?: boolean | undefined;
  /** @deprecated */
  charset?: string | undefined;
  crossorigin?: true | "anonymous" | "use-credentials" | "" | undefined;
  defer?: boolean | undefined;
  integrity?: string | undefined;
  nomodule?: boolean | undefined;
  nonce?: string | undefined;
  referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
  src?: string | undefined;
  type?: string | undefined;
}

export interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
  autocomplete?: string | undefined;
  autofocus?: boolean | undefined;
  disabled?: boolean | undefined;
  form?: string | undefined;
  multiple?: boolean | undefined;
  name?: string | undefined;
  required?: boolean | undefined;
  size?: number | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
  onchange?: ChangeEventHandler<T> | undefined;
}

export interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
  height?: number | string | undefined;
  media?: string | undefined;
  sizes?: string | undefined;
  src?: string | undefined;
  srcset?: string | undefined;
  type?: string | undefined;
  width?: number | string | undefined;
}

export interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
  media?: string | undefined;
  nonce?: string | undefined;
  scoped?: boolean | undefined;
  type?: string | undefined;
}

export interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
  summary?: string | undefined;
  width?: number | string | undefined;
}

export interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
  autocomplete?: string | undefined;
  autofocus?: boolean | undefined;
  cols?: number | undefined;
  dirname?: string | undefined;
  disabled?: boolean | undefined;
  form?: string | undefined;
  maxlength?: number | undefined;
  minlength?: number | undefined;
  name?: string | undefined;
  placeholder?: string | undefined;
  readonly?: boolean | undefined;
  required?: boolean | undefined;
  rows?: number | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
  wrap?: string | undefined;

  onchange?: ChangeEventHandler<T> | undefined;
}

export interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
  align?: "left" | "center" | "right" | "justify" | "char" | undefined;
  colspan?: number | undefined;
  headers?: string | undefined;
  rowspan?: number | undefined;
  scope?: string | undefined;
  abbr?: string | undefined;
  height?: number | string | undefined;
  width?: number | string | undefined;
}

export interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
  align?: "left" | "center" | "right" | "justify" | "char" | undefined;
  colspan?: number | undefined;
  headers?: string | undefined;
  rowspan?: number | undefined;
  scope?: string | undefined;
  abbr?: string | undefined;
}

export interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
  datetime?: string | undefined;
}

export interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
  default?: boolean | undefined;
  kind?: string | undefined;
  label?: string | undefined;
  src?: string | undefined;
  srclang?: string | undefined;
}

export interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
  height?: number | string | undefined;
  playsinline?: boolean | undefined;
  poster?: string | undefined;
  width?: number | string | undefined;
  disablePictureInPicture?: boolean | undefined;
  disableRemotePlayback?: boolean | undefined;
}

// The three broad type categories are (in order of restrictiveness):
//   - "number | string"
//   - "string"
//   - union of string literals
export interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
  // Attributes which also defined in HTMLAttributes
  class?: string | undefined;
  color?: string | undefined;
  height?: number | string | undefined;
  id?: string | undefined;
  lang?: string | undefined;
  max?: number | string | undefined;
  media?: string | undefined;
  method?: string | undefined;
  min?: number | string | undefined;
  name?: string | undefined;
  style?: string | undefined;
  target?: string | undefined;
  type?: string | undefined;
  width?: number | string | undefined;

  // Other HTML properties supported by SVG elements in browsers
  role?: AriaRole | undefined;
  tabindex?: number | undefined;
  crossorigin?: true | "anonymous" | "use-credentials" | "" | undefined;

  // SVG Specific attributes
  contentScriptType?: number | string | undefined;
  contentStyleType?: number | string | undefined;
  cursor?: number | string | undefined;
  display?: number | string | undefined;
  fill?: string | undefined;
  filter?: string | undefined;
  mask?: string | undefined;
  opacity?: number | string | undefined;
  preserveAspectRatio?: string | undefined;
  requiredExtensions?: number | string | undefined;
  stroke?: string | undefined;
  systemLanguage?: number | string | undefined;
  transform?: string | undefined;
  viewBox?: string | undefined;
  visibility?: number | string | undefined;
  x?: number | string | undefined;
  xmlns?: string | undefined;
  y?: number | string | undefined;
}

export type ElementTagHTMLAttributes = AllHTMLAttributes<"div"> & {
  tag?: string;
};

type ExoticElements = Record<
  string,
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
>;

declare global {
  namespace JSX {
    type Element = NullstackNode;

    interface IntrinsicAttributes extends NullstackAttributes {}
    interface IntrinsicClassAttributes extends ClassAttributes {}

    interface AllElements {
      // HTML
      a: DetailedHTMLProps<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >;
      abbr: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      address: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      area: DetailedHTMLProps<
        AreaHTMLAttributes<HTMLAreaElement>,
        HTMLAreaElement
      >;
      article: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      aside: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      audio: DetailedHTMLProps<
        AudioHTMLAttributes<HTMLAudioElement>,
        HTMLAudioElement
      >;
      b: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      base: DetailedHTMLProps<
        BaseHTMLAttributes<HTMLBaseElement>,
        HTMLBaseElement
      >;
      bdi: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      bdo: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      big: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      blockquote: DetailedHTMLProps<
        BlockquoteHTMLAttributes<HTMLQuoteElement>,
        HTMLQuoteElement
      >;
      body: DetailedHTMLProps<HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
      br: DetailedHTMLProps<HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
      button: DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >;
      canvas: DetailedHTMLProps<
        CanvasHTMLAttributes<HTMLCanvasElement>,
        HTMLCanvasElement
      >;
      caption: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      cite: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      code: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      col: DetailedHTMLProps<
        ColHTMLAttributes<HTMLTableColElement>,
        HTMLTableColElement
      >;
      colgroup: DetailedHTMLProps<
        ColgroupHTMLAttributes<HTMLTableColElement>,
        HTMLTableColElement
      >;
      data: DetailedHTMLProps<
        DataHTMLAttributes<HTMLDataElement>,
        HTMLDataElement
      >;
      datalist: DetailedHTMLProps<
        HTMLAttributes<HTMLDataListElement>,
        HTMLDataListElement
      >;
      dd: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      del: DetailedHTMLProps<DelHTMLAttributes<HTMLModElement>, HTMLModElement>;
      details: DetailedHTMLProps<
        DetailsHTMLAttributes<HTMLDetailsElement>,
        HTMLDetailsElement
      >;
      dfn: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      dialog: DetailedHTMLProps<
        DialogHTMLAttributes<HTMLDialogElement>,
        HTMLDialogElement
      >;
      div: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      dl: DetailedHTMLProps<HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
      dt: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      em: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      embed: DetailedHTMLProps<
        EmbedHTMLAttributes<HTMLEmbedElement>,
        HTMLEmbedElement
      >;
      fieldset: DetailedHTMLProps<
        FieldsetHTMLAttributes<HTMLFieldSetElement>,
        HTMLFieldSetElement
      >;
      figcaption: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      figure: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      footer: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      form: DetailedHTMLProps<
        FormHTMLAttributes<HTMLFormElement>,
        HTMLFormElement
      >;
      h1: DetailedHTMLProps<
        HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h2: DetailedHTMLProps<
        HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h3: DetailedHTMLProps<
        HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h4: DetailedHTMLProps<
        HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h5: DetailedHTMLProps<
        HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h6: DetailedHTMLProps<
        HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      head: DetailedHTMLProps<HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
      header: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      hgroup: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      hr: DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
      html: DetailedHTMLProps<
        HtmlHTMLAttributes<HTMLHtmlElement>,
        HTMLHtmlElement
      >;
      i: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      iframe: DetailedHTMLProps<
        IframeHTMLAttributes<HTMLIFrameElement>,
        HTMLIFrameElement
      >;
      img: DetailedHTMLProps<
        ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
      >;
      input: DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >;
      ins: DetailedHTMLProps<InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
      kbd: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      /** @deprecated */
      keygen: DetailedHTMLProps<KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
      label: DetailedHTMLProps<
        LabelHTMLAttributes<HTMLLabelElement>,
        HTMLLabelElement
      >;
      legend: DetailedHTMLProps<
        HTMLAttributes<HTMLLegendElement>,
        HTMLLegendElement
      >;
      li: DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
      link: DetailedHTMLProps<
        LinkHTMLAttributes<HTMLLinkElement>,
        HTMLLinkElement
      >;
      main: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      map: DetailedHTMLProps<MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
      mark: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      menu: DetailedHTMLProps<MenuHTMLAttributes<HTMLElement>, HTMLElement>;
      menuitem: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      meta: DetailedHTMLProps<
        MetaHTMLAttributes<HTMLMetaElement>,
        HTMLMetaElement
      >;
      meter: DetailedHTMLProps<
        MeterHTMLAttributes<HTMLMeterElement>,
        HTMLMeterElement
      >;
      nav: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      noindex: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      noscript: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      object: DetailedHTMLProps<
        ObjectHTMLAttributes<HTMLObjectElement>,
        HTMLObjectElement
      >;
      ol: DetailedHTMLProps<
        OlHTMLAttributes<HTMLOListElement>,
        HTMLOListElement
      >;
      optgroup: DetailedHTMLProps<
        OptgroupHTMLAttributes<HTMLOptGroupElement>,
        HTMLOptGroupElement
      >;
      option: DetailedHTMLProps<
        OptionHTMLAttributes<HTMLOptionElement>,
        HTMLOptionElement
      >;
      output: DetailedHTMLProps<
        OutputHTMLAttributes<HTMLOutputElement>,
        HTMLOutputElement
      >;
      p: DetailedHTMLProps<
        HTMLAttributes<HTMLParagraphElement>,
        HTMLParagraphElement
      >;
      param: DetailedHTMLProps<
        ParamHTMLAttributes<HTMLParamElement>,
        HTMLParamElement
      >;
      picture: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      pre: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
      progress: DetailedHTMLProps<
        ProgressHTMLAttributes<HTMLProgressElement>,
        HTMLProgressElement
      >;
      q: DetailedHTMLProps<
        QuoteHTMLAttributes<HTMLQuoteElement>,
        HTMLQuoteElement
      >;
      rp: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      rt: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      ruby: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      s: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      samp: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      slot: DetailedHTMLProps<
        SlotHTMLAttributes<HTMLSlotElement>,
        HTMLSlotElement
      >;
      script: DetailedHTMLProps<
        ScriptHTMLAttributes<HTMLScriptElement>,
        HTMLScriptElement
      >;
      section: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      select: DetailedHTMLProps<
        SelectHTMLAttributes<HTMLSelectElement>,
        HTMLSelectElement
      >;
      small: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      source: DetailedHTMLProps<
        SourceHTMLAttributes<HTMLSourceElement>,
        HTMLSourceElement
      >;
      span: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      strong: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      style: DetailedHTMLProps<
        StyleHTMLAttributes<HTMLStyleElement>,
        HTMLStyleElement
      >;
      sub: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      summary: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      sup: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      table: DetailedHTMLProps<
        TableHTMLAttributes<HTMLTableElement>,
        HTMLTableElement
      >;
      template: DetailedHTMLProps<
        HTMLAttributes<HTMLTemplateElement>,
        HTMLTemplateElement
      >;
      tbody: DetailedHTMLProps<
        HTMLAttributes<HTMLTableSectionElement>,
        HTMLTableSectionElement
      >;
      td: DetailedHTMLProps<
        TdHTMLAttributes<HTMLTableDataCellElement>,
        HTMLTableDataCellElement
      >;
      textarea: DetailedHTMLProps<
        TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
      >;
      tfoot: DetailedHTMLProps<
        HTMLAttributes<HTMLTableSectionElement>,
        HTMLTableSectionElement
      >;
      th: DetailedHTMLProps<
        ThHTMLAttributes<HTMLTableHeaderCellElement>,
        HTMLTableHeaderCellElement
      >;
      thead: DetailedHTMLProps<
        HTMLAttributes<HTMLTableSectionElement>,
        HTMLTableSectionElement
      >;
      time: DetailedHTMLProps<
        TimeHTMLAttributes<HTMLTimeElement>,
        HTMLTimeElement
      >;
      title: DetailedHTMLProps<
        HTMLAttributes<HTMLTitleElement>,
        HTMLTitleElement
      >;
      tr: DetailedHTMLProps<
        HTMLAttributes<HTMLTableRowElement>,
        HTMLTableRowElement
      >;
      track: DetailedHTMLProps<
        TrackHTMLAttributes<HTMLTrackElement>,
        HTMLTrackElement
      >;
      u: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      ul: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
      var: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      video: DetailedHTMLProps<
        VideoHTMLAttributes<HTMLVideoElement>,
        HTMLVideoElement
      >;
      wbr: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

      // SVG
      svg: SVGProps<SVGSVGElement>;

      animate: SVGProps<SVGElement>; // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
      animateMotion: SVGProps<SVGElement>;
      animateTransform: SVGProps<SVGElement>; // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
      circle: SVGProps<SVGCircleElement>;
      clipPath: SVGProps<SVGClipPathElement>;
      defs: SVGProps<SVGDefsElement>;
      desc: SVGProps<SVGDescElement>;
      ellipse: SVGProps<SVGEllipseElement>;
      feBlend: SVGProps<SVGFEBlendElement>;
      feColorMatrix: SVGProps<SVGFEColorMatrixElement>;
      feComponentTransfer: SVGProps<SVGFEComponentTransferElement>;
      feComposite: SVGProps<SVGFECompositeElement>;
      feConvolveMatrix: SVGProps<SVGFEConvolveMatrixElement>;
      feDiffuseLighting: SVGProps<SVGFEDiffuseLightingElement>;
      feDisplacementMap: SVGProps<SVGFEDisplacementMapElement>;
      feDistantLight: SVGProps<SVGFEDistantLightElement>;
      feDropShadow: SVGProps<SVGFEDropShadowElement>;
      feFlood: SVGProps<SVGFEFloodElement>;
      feFuncA: SVGProps<SVGFEFuncAElement>;
      feFuncB: SVGProps<SVGFEFuncBElement>;
      feFuncG: SVGProps<SVGFEFuncGElement>;
      feFuncR: SVGProps<SVGFEFuncRElement>;
      feGaussianBlur: SVGProps<SVGFEGaussianBlurElement>;
      feImage: SVGProps<SVGFEImageElement>;
      feMerge: SVGProps<SVGFEMergeElement>;
      feMergeNode: SVGProps<SVGFEMergeNodeElement>;
      feMorphology: SVGProps<SVGFEMorphologyElement>;
      feOffset: SVGProps<SVGFEOffsetElement>;
      fePointLight: SVGProps<SVGFEPointLightElement>;
      feSpecularLighting: SVGProps<SVGFESpecularLightingElement>;
      feSpotLight: SVGProps<SVGFESpotLightElement>;
      feTile: SVGProps<SVGFETileElement>;
      feTurbulence: SVGProps<SVGFETurbulenceElement>;
      filter: SVGProps<SVGFilterElement>;
      foreignObject: SVGProps<SVGForeignObjectElement>;
      g: SVGProps<SVGGElement>;
      image: SVGProps<SVGImageElement>;
      line: SVGProps<SVGLineElement>;
      linearGradient: SVGProps<SVGLinearGradientElement>;
      marker: SVGProps<SVGMarkerElement>;
      mask: SVGProps<SVGMaskElement>;
      metadata: SVGProps<SVGMetadataElement>;
      mpath: SVGProps<SVGElement>;
      path: SVGProps<SVGPathElement>;
      pattern: SVGProps<SVGPatternElement>;
      polygon: SVGProps<SVGPolygonElement>;
      polyline: SVGProps<SVGPolylineElement>;
      radialGradient: SVGProps<SVGRadialGradientElement>;
      rect: SVGProps<SVGRectElement>;
      stop: SVGProps<SVGStopElement>;
      switch: SVGProps<SVGSwitchElement>;
      symbol: SVGProps<SVGSymbolElement>;
      text: SVGProps<SVGTextElement>;
      textPath: SVGProps<SVGTextPathElement>;
      tspan: SVGProps<SVGTSpanElement>;
      use: SVGProps<SVGUseElement>;
      view: SVGProps<SVGViewElement>;
      element: ElementTagHTMLAttributes;
    }

    interface IntrinsicElements extends ExoticElements, AllElements {}
  }
}
