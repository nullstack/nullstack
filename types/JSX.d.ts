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

import { NullstackClientContext } from './ClientContext';

type NativeDragEvent = globalThis.DragEvent;
type NativeFocusEvent = globalThis.FocusEvent;
type NativeKeyboardEvent = globalThis.KeyboardEvent;
type NativeMouseEvent = globalThis.MouseEvent;
type NativePointerEvent = globalThis.PointerEvent;
type NativeUIEvent = globalThis.UIEvent;
type NativeWheelEvent = globalThis.WheelEvent;
type Booleanish = boolean | 'true' | 'false';

//
// Nullstack Elements
// ----------------------------------------------------------------------

export interface Attributes {
  html?: string;
  source?: object;
  bind?: any;
  debounce?: number;
  ref?: any;
  'data-'?: any;
  children?: NullstackNode;
  route?: string;
  persistent?: boolean;
  [key: string]: any;
}

export interface NullstackAttributes extends Attributes { }

export interface ClassAttributes extends Attributes {
  key?: string;
}

//
// Factories
// ----------------------------------------------------------------------

type DetailedHTMLFactory<P, T = any> = P;

export interface SVGFactory { }

export type NullstackFragment = NullstackNode[];
export type NullstackNode = NullstackFragment | string | number | boolean | null | undefined;

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
export interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> { }

export interface DragEvent<T = Element> extends MouseEvent<T, NativeDragEvent> {
  dataTransfer: DataTransfer;
}

export interface PointerEvent<T = Element> extends MouseEvent<T, NativePointerEvent> {
  pointerId: number;
  pressure: number;
  tangentialPressure: number;
  tiltX: number;
  tiltY: number;
  twist: number;
  width: number;
  height: number;
  pointerType: 'mouse' | 'pen' | 'touch';
  isPrimary: boolean;
}

export interface FocusEvent<Target = Element, RelatedTarget = Element>
  extends SyntheticEvent<Target, NativeFocusEvent> {
  relatedTarget: (EventTarget & RelatedTarget) | null;
  target: EventTarget & Target;
}

export interface FormEvent<T = Element> extends SyntheticEvent<T> { }

export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T;
}

export interface KeyboardEvent<T = Element> extends UIEvent<T, NativeKeyboardEvent> {
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

export interface MouseEvent<T = Element, E = NativeMouseEvent> extends UIEvent<T, E> {
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

export interface UIEvent<T = Element, E = NativeUIEvent> extends SyntheticEvent<T, E> {
  detail: number;
}

export interface WheelEvent<T = Element> extends MouseEvent<T, NativeWheelEvent> {
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
  }['bivarianceHack'];

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

export interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes { }

export interface DOMAttributes<T> extends Attributes {
  // Focus Events
  onfocus?: FocusEventHandler<T>;
  onblur?: FocusEventHandler<T>;

  // Form Events
  onchange?: FormEventHandler<T>;
  oninput?: FormEventHandler<T>;
  onreset?: FormEventHandler<T>;
  onsubmit?: FormEventHandler<T>;
  oninvalid?: FormEventHandler<T>;

  // Image Events
  onload?: NullstackEventHandler<T>;
  onerror?: NullstackEventHandler<T>; // also a Media Event

  // Keyboard Events
  onkeydown?: KeyboardEventHandler<T>;
  /** @deprecated */
  onkeypress?: KeyboardEventHandler<T>;
  onkeyup?: KeyboardEventHandler<T>;

  // Media Events
  onabort?: NullstackEventHandler<T>;
  oncanplay?: NullstackEventHandler<T>;
  oncanplaythrough?: NullstackEventHandler<T>;
  ondurationchange?: NullstackEventHandler<T>;
  onemptied?: NullstackEventHandler<T>;
  onended?: NullstackEventHandler<T>;
  onloadeddata?: NullstackEventHandler<T>;
  onloadedmetadata?: NullstackEventHandler<T>;
  onloadstart?: NullstackEventHandler<T>;
  onpause?: NullstackEventHandler<T>;
  onplay?: NullstackEventHandler<T>;
  onplaying?: NullstackEventHandler<T>;
  onprogress?: NullstackEventHandler<T>;
  onratechange?: NullstackEventHandler<T>;
  onseeked?: NullstackEventHandler<T>;
  onseeking?: NullstackEventHandler<T>;
  onstalled?: NullstackEventHandler<T>;
  onsuspend?: NullstackEventHandler<T>;
  ontimeupdate?: NullstackEventHandler<T>;
  onvolumechange?: NullstackEventHandler<T>;
  onwaiting?: NullstackEventHandler<T>;

  // MouseEvents
  onclick?: MouseEventHandler<T>;
  oncontextmenu?: MouseEventHandler<T>;
  ondblclick?: MouseEventHandler<T>;
  ondrag?: DragEventHandler<T>;
  ondragend?: DragEventHandler<T>;
  ondragenter?: DragEventHandler<T>;
  ondragleave?: DragEventHandler<T>;
  ondragover?: DragEventHandler<T>;
  ondragstart?: DragEventHandler<T>;
  ondrop?: DragEventHandler<T>;
  onmousedown?: MouseEventHandler<T>;
  onmouseenter?: MouseEventHandler<T>;
  onmouseleave?: MouseEventHandler<T>;
  onmousemove?: MouseEventHandler<T>;
  onmouseout?: MouseEventHandler<T>;
  onmouseover?: MouseEventHandler<T>;
  onmouseup?: MouseEventHandler<T>;

  // Wheel Events
  /** @deprecated */
  onmousewheel?: WheelEventHandler<T>;

  // Selection Events
  onselect?: NullstackEventHandler<T>;

  // Pointer Events
  onpointerdown?: PointerEventHandler<T>;
  onpointermove?: PointerEventHandler<T>;
  onpointerup?: PointerEventHandler<T>;
  onpointercancel?: PointerEventHandler<T>;
  onpointerenter?: PointerEventHandler<T>;
  onpointerleave?: PointerEventHandler<T>;
  onpointerover?: PointerEventHandler<T>;
  onpointerout?: PointerEventHandler<T>;

  // UI Events
  onscroll?: UIEventHandler<T>;
}

// All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
export interface AriaAttributes {
  /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or applicatio */
  'aria-activedescendant'?: string;
  /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
  'aria-atomic'?: Booleanish;
  /**
   * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
   * presented if they are made.
   */
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both';
  /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
  'aria-busy'?: Booleanish;
  /**
   * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
   * @see aria-pressed @see aria-selected.
   */
  'aria-checked'?: boolean | 'false' | 'mixed' | 'true';
  /**
   * Defines the total number of columns in a table, grid, or treegrid.
   * @see aria-colindex.
   */
  'aria-colcount'?: number;
  /**
   * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
   * @see aria-colcount @see aria-colspa
   */
  'aria-colindex'?: number;
  /**
   * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
   * @see aria-colindex @see aria-rowspa
   */
  'aria-colspan'?: number;
  /**
   * Identifies the element (or elements) whose contents or presence are controlled by the current element.
   * @see aria-owns.
   */
  'aria-controls'?: string;
  /** Indicates the element that represents the current item within a container or set of related elements. */
  'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time';
  /**
   * Identifies the element (or elements) that describes the object.
   * @see aria-labelledby
   */
  'aria-describedby'?: string;
  /**
   * Identifies the element that provides a detailed, extended description for the object.
   * @see aria-describedby.
   */
  'aria-details'?: string;
  /**
   * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
   * @see aria-hidden @see aria-readonly.
   */
  'aria-disabled'?: Booleanish;
  /**
   * Indicates what functions can be performed when a dragged object is released on the drop target.
   * @deprecated in ARIA 1.1
   */
  'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup';
  /**
   * Identifies the element that provides an error message for the object.
   * @see aria-invalid @see aria-describedby.
   */
  'aria-errormessage'?: string;
  /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
  'aria-expanded'?: Booleanish;
  /**
   * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
   * allows assistive technology to override the general default of reading in document source order.
   */
  'aria-flowto'?: string;
  /**
   * Indicates an element's "grabbed" state in a drag-and-drop operatio
   * @deprecated in ARIA 1.1
   */
  'aria-grabbed'?: Booleanish;
  /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  /**
   * Indicates whether the element is exposed to an accessibility API.
   * @see aria-disabled.
   */
  'aria-hidden'?: Booleanish;
  /**
   * Indicates the entered value does not conform to the format expected by the applicatio
   * @see aria-errormessage.
   */
  'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
  /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
  'aria-keyshortcuts'?: string;
  /**
   * Defines a string value that labels the current element.
   * @see aria-labelledby.
   */
  'aria-label'?: string;
  /**
   * Identifies the element (or elements) that labels the current element.
   * @see aria-describedby.
   */
  'aria-labelledby'?: string;
  /** Defines the hierarchical level of an element within a structure. */
  'aria-level'?: number;
  /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live regio */
  'aria-live'?: 'off' | 'assertive' | 'polite';
  /** Indicates whether an element is modal when displayed. */
  'aria-modal'?: Booleanish;
  /** Indicates whether a text box accepts multiple lines of input or only a single line. */
  'aria-multiline'?: Booleanish;
  /** Indicates that the user may select more than one item from the current selectable descendants. */
  'aria-multiselectable'?: Booleanish;
  /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
  'aria-orientation'?: 'horizontal' | 'vertical';
  /**
   * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
   * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
   * @see aria-controls.
   */
  'aria-owns'?: string;
  /**
   * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
   * A hint could be a sample value or a brief description of the expected format.
   */
  'aria-placeholder'?: string;
  /**
   * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
   * @see aria-setsize.
   */
  'aria-posinset'?: number;
  /**
   * Indicates the current "pressed" state of toggle buttons.
   * @see aria-checked @see aria-selected.
   */
  'aria-pressed'?: boolean | 'false' | 'mixed' | 'true';
  /**
   * Indicates that the element is not editable, but is otherwise operable.
   * @see aria-disabled.
   */
  'aria-readonly'?: Booleanish;
  /**
   * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
   * @see aria-atomic.
   */
  'aria-relevant'?:
  | 'additions'
  | 'additions removals'
  | 'additions text'
  | 'all'
  | 'removals'
  | 'removals additions'
  | 'removals text'
  | 'text'
  | 'text additions'
  | 'text removals'
  | undefined;
  /** Indicates that user input is required on the element before a form may be submitted. */
  'aria-required'?: Booleanish;
  /** Defines a human-readable, author-localized description for the role of an element. */
  'aria-roledescription'?: string;
  /**
   * Defines the total number of rows in a table, grid, or treegrid.
   * @see aria-rowindex.
   */
  'aria-rowcount'?: number;
  /**
   * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
   * @see aria-rowcount @see aria-rowspa
   */
  'aria-rowindex'?: number;
  /**
   * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
   * @see aria-rowindex @see aria-colspa
   */
  'aria-rowspan'?: number;
  /**
   * Indicates the current "selected" state of various widgets.
   * @see aria-checked @see aria-pressed.
   */
  'aria-selected'?: Booleanish;
  /**
   * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
   * @see aria-posinset.
   */
  'aria-setsize'?: number;
  /** Indicates if items in a table or grid are sorted in ascending or descending order. */
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
  /** Defines the maximum allowed value for a range widget. */
  'aria-valuemax'?: number;
  /** Defines the minimum allowed value for a range widget. */
  'aria-valuemin'?: number;
  /**
   * Defines the current value for a range widget.
   * @see aria-valuetext.
   */
  'aria-valuenow'?: number;
  /** Defines the human readable text alternative of aria-valuenow for a range widget. */
  'aria-valuetext'?: string;
}

// All the WAI-ARIA 1.1 role attribute values from https://www.w3.org/TR/wai-aria-1.1/#role_definitions
type AriaRole =
  | 'alert'
  | 'alertdialog'
  | 'application'
  | 'article'
  | 'banner'
  | 'button'
  | 'cell'
  | 'checkbox'
  | 'columnheader'
  | 'combobox'
  | 'complementary'
  | 'contentinfo'
  | 'definition'
  | 'dialog'
  | 'directory'
  | 'document'
  | 'feed'
  | 'figure'
  | 'form'
  | 'grid'
  | 'gridcell'
  | 'group'
  | 'heading'
  | 'img'
  | 'link'
  | 'list'
  | 'listbox'
  | 'listitem'
  | 'log'
  | 'main'
  | 'marquee'
  | 'math'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'navigation'
  | 'none'
  | 'note'
  | 'option'
  | 'presentation'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'region'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'scrollbar'
  | 'search'
  | 'searchbox'
  | 'separator'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'switch'
  | 'tab'
  | 'table'
  | 'tablist'
  | 'tabpanel'
  | 'term'
  | 'textbox'
  | 'timer'
  | 'toolbar'
  | 'tooltip'
  | 'tree'
  | 'treegrid'
  | 'treeitem'
  | (string & {});

export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
  // Standard HTML Attributes
  accesskey?: string;
  class?: string;
  contenteditable?: Booleanish | 'inherit';
  contextmenu?: string;
  dir?: string;
  draggable?: Booleanish;
  hidden?: boolean;
  id?: string;
  lang?: string;
  placeholder?: string;
  slot?: string;
  spellcheck?: Booleanish;
  style?: string;
  tabindex?: number | string;
  title?: string;
  translate?: 'yes' | 'no';

  // WAI-ARIA
  role?: AriaRole;

  // Non-standard Attributes
  autocapitalize?: string;
  itemprop?: string;
  itemscope?: boolean;
  itemtype?: string;
  itemid?: string;
  itemref?: string;

  // Living Standard
  /**
   * Hints at the type of data that might be entered by the user while editing the element or its contents
   * @see https://html.spec.whatwg.org/multipage/interactiohtml#input-modalities:-the-inputmode-attribute
   */
  inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  /**
   * Specify that a standard HTML element should behave like a defined custom built-in element
   * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
   */
  is?: string;
}

export interface AllHTMLAttributes<T> extends HTMLAttributes<T> {
  // Standard HTML Attributes
  accept?: string;
  'accept-charset'?: string;
  action?: string;
  allowfullScreen?: boolean;
  allowTransparency?: boolean;
  alt?: string;
  as?: string;
  async?: boolean;
  autocomplete?: string;
  autofocus?: boolean;
  autoplay?: boolean;
  capture?: boolean | 'user' | 'environment';
  charset?: string;
  checked?: boolean;
  cite?: string;
  classid?: string;
  cols?: number;
  colspan?: number;
  content?: string;
  controls?: boolean;
  coords?: string;
  crossorigin?: 'anonymous' | 'use-credentials' | '';
  datetime?: string;
  default?: boolean;
  defer?: boolean;
  disabled?: boolean;
  download?: any;
  enctype?: string;
  form?: string;
  formaction?: string;
  formenctype?: string;
  formmethod?: string;
  formnovalidate?: boolean;
  formtarget?: string;
  headers?: string;
  height?: number | string;
  high?: number;
  href?: string;
  hreflang?: string;
  'http-equiv'?: string;
  integrity?: string;
  kind?: string;
  label?: string;
  list?: string;
  loop?: boolean;
  low?: number;
  manifest?: string;
  max?: number | string;
  maxlength?: number;
  media?: string;
  mediagroup?: string;
  method?: string;
  min?: number | string;
  minlength?: number;
  multiple?: boolean;
  muted?: boolean;
  name?: string;
  nonce?: string;
  novalidate?: boolean;
  open?: boolean;
  optimum?: number;
  pattern?: string;
  placeholder?: string;
  playsinline?: boolean;
  poster?: string;
  preload?: string;
  readonly?: boolean;
  rel?: string;
  required?: boolean;
  reversed?: boolean;
  rows?: number;
  rowspan?: number;
  sandbox?: string;
  scope?: string;
  scoped?: boolean;
  seamless?: boolean;
  selected?: boolean;
  shape?: string;
  size?: number;
  sizes?: string;
  span?: number;
  src?: string;
  srcdoc?: string;
  srclang?: string;
  srcset?: string;
  start?: number;
  step?: number | string;
  summary?: string;
  target?: string;
  type?: string;
  usemap?: string;
  value?: string | ReadonlyArray<string> | number;
  width?: number | string;
  wrap?: string;
}

type HTMLAttributeReferrerPolicy =
  | ''
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

type HTMLAttributeAnchorTarget = '_self' | '_blank' | '_parent' | '_top' | (string & {});

export interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
  download?: any;
  href?: string;
  hreflang?: string;
  media?: string;
  ping?: string;
  rel?: string;
  target?: HTMLAttributeAnchorTarget;
  type?: string;
  referrerpolicy?: HTMLAttributeReferrerPolicy;

  // Nullstack Router
  params?: object;
  path?: string;
}

export interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> { }

export interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
  alt?: string;
  coords?: string;
  download?: any;
  href?: string;
  hreflang?: string;
  media?: string;
  referrerpolicy?: HTMLAttributeReferrerPolicy;
  rel?: string;
  shape?: string;
  target?: string;
}

export interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
  href?: string;
  target?: string;
}

export interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
  cite?: string;
}

export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
  autofocus?: boolean;
  disabled?: boolean;
  form?: string;
  formaction?: string;
  formenctype?: string;
  formmethod?: string;
  formnovalidate?: boolean;
  formtarget?: string;
  name?: string;
  type?: 'submit' | 'reset' | 'button';
  value?: string | ReadonlyArray<string> | number;
}

export interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
  height?: number | string;
  width?: number | string;
}

export interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
  span?: number;
  /** @deprecated */
  width?: number | string;
}

export interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
  span?: number;
}

export interface DataHTMLAttributes<T> extends HTMLAttributes<T> {
  value?: string | ReadonlyArray<string> | number;
}

export interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
  open?: boolean;
}

export interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
  cite?: string;
  datetime?: string;
}

export interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
  open?: boolean;
}

export interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
  height?: number | string;
  src?: string;
  type?: string;
  width?: number | string;
}

export interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
  disabled?: boolean;
  form?: string;
  name?: string;
}

export interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
  'accept-charset'?: string;
  action?: string;
  autocomplete?: string;
  enctype?: string;
  method?: string;
  name?: string;
  novalidate?: boolean;
  target?: string;
}

export interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
  manifest?: string;
}

export interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
  allow?: string;
  allowfullScreen?: boolean;
  allowTransparency?: boolean;
  /** @deprecated */
  frameBorder?: number | string;
  height?: number | string;
  loading?: 'eager' | 'lazy';
  /** @deprecated */
  marginHeight?: number;
  /** @deprecated */
  marginWidth?: number;
  name?: string;
  referrerpolicy?: HTMLAttributeReferrerPolicy;
  sandbox?: string;
  /** @deprecated */
  scrolling?: string;
  seamless?: boolean;
  src?: string;
  srcdoc?: string;
  width?: number | string;
}

export interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
  alt?: string;
  crossorigin?: 'anonymous' | 'use-credentials' | '';
  decoding?: 'async' | 'auto' | 'sync';
  height?: number | string;
  loading?: 'eager' | 'lazy';
  referrerpolicy?: HTMLAttributeReferrerPolicy;
  sizes?: string;
  src?: string;
  srcset?: string;
  usemap?: string;
  width?: number | string;
}

export interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
  cite?: string;
  datetime?: string;
}

type HTMLInputTypeAttribute =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'
  | (string & {});

export interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
  accept?: string;
  alt?: string;
  autocomplete?: string;
  autofocus?: boolean;
  /** @see https://www.w3.org/TR/html-media-capture/#the-capture-attribute */
  capture?: boolean | 'user' | 'environment';
  checked?: boolean;
  disabled?: boolean;
  enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  form?: string;
  formaction?: string;
  formenctype?: string;
  formmethod?: string;
  formnovalidate?: boolean;
  formtarget?: string;
  height?: number | string;
  list?: string;
  max?: number | string;
  maxlength?: number;
  min?: number | string;
  minlength?: number;
  multiple?: boolean;
  name?: string;
  pattern?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  size?: number;
  src?: string;
  step?: number | string;
  type?: HTMLInputTypeAttribute;
  value?: string | ReadonlyArray<string> | number;
  width?: number | string;

  onchange?: ChangeEventHandler<T>;
}

export interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
  autofocus?: boolean;
  challenge?: string;
  disabled?: boolean;
  form?: string;
  keytype?: string;
  keyparams?: string;
  name?: string;
}

export interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
  form?: string;
}

export interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
  value?: string | ReadonlyArray<string> | number;
}

export interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
  as?: string;
  crossorigin?: true | 'anonymous' | 'use-credentials' | '';
  href?: string;
  hreflang?: string;
  integrity?: string;
  media?: string;
  referrerpolicy?: HTMLAttributeReferrerPolicy;
  rel?: string;
  sizes?: string;
  type?: string;
  charset?: string;
}

export interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
  name?: string;
}

export interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
  type?: string;
}

export interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
  autoplay?: boolean;
  controls?: boolean;
  crossorigin?: true | 'anonymous' | 'use-credentials' | '';
  loop?: boolean;
  mediagroup?: string;
  muted?: boolean;
  playsinline?: boolean;
  preload?: string;
  src?: string;
}

export interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
  charset?: string;
  content?: string;
  'http-equiv'?: string;
  name?: string;
  media?: string;
}

export interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
  form?: string;
  high?: number;
  low?: number;
  max?: number | string;
  min?: number | string;
  optimum?: number;
  value?: string | ReadonlyArray<string> | number;
}

export interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
  cite?: string;
}

export interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
  classid?: string;
  form?: string;
  height?: number | string;
  name?: string;
  type?: string;
  usemap?: string;
  width?: number | string;
}

export interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
  reversed?: boolean;
  start?: number;
  type?: '1' | 'a' | 'A' | 'i' | 'I';
}

export interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
  disabled?: boolean;
  label?: string;
}

export interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
  disabled?: boolean;
  label?: string;
  selected?: boolean;
  value?: string | ReadonlyArray<string> | number | boolean;
}

export interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
  form?: string;
  name?: string;
}

export interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
  name?: string;
  value?: string | ReadonlyArray<string> | number;
}

export interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
  max?: number | string;
  value?: string | ReadonlyArray<string> | number;
}

export interface SlotHTMLAttributes<T> extends HTMLAttributes<T> {
  name?: string;
}

export interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
  async?: boolean;
  /** @deprecated */
  charset?: string;
  crossorigin?: true | 'anonymous' | 'use-credentials' | '';
  defer?: boolean;
  integrity?: string;
  nomodule?: boolean;
  nonce?: string;
  referrerpolicy?: HTMLAttributeReferrerPolicy;
  src?: string;
  type?: string;
}

export interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
  autocomplete?: string;
  autofocus?: boolean;
  disabled?: boolean;
  form?: string;
  multiple?: boolean;
  name?: string;
  required?: boolean;
  size?: number;
  value?: string | ReadonlyArray<string> | number;
  onchange?: ChangeEventHandler<T>;
}

export interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
  height?: number | string;
  media?: string;
  sizes?: string;
  src?: string;
  srcset?: string;
  type?: string;
  width?: number | string;
}

export interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
  media?: string;
  nonce?: string;
  scoped?: boolean;
  type?: string;
}

export interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
  summary?: string;
  width?: number | string;
}

export interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
  autocomplete?: string;
  autofocus?: boolean;
  cols?: number;
  dirname?: string;
  disabled?: boolean;
  form?: string;
  maxlength?: number;
  minlength?: number;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  rows?: number;
  value?: string | ReadonlyArray<string> | number;
  wrap?: string;

  onchange?: ChangeEventHandler<T>;
}

export interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
  align?: 'left' | 'center' | 'right' | 'justify' | 'char';
  colspan?: number;
  headers?: string;
  rowspan?: number;
  scope?: string;
  abbr?: string;
  height?: number | string;
  width?: number | string;
}

export interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
  align?: 'left' | 'center' | 'right' | 'justify' | 'char';
  colspan?: number;
  headers?: string;
  rowspan?: number;
  scope?: string;
  abbr?: string;
}

export interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
  datetime?: string;
}

export interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
  default?: boolean;
  kind?: string;
  label?: string;
  src?: string;
  srclang?: string;
}

export interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
  height?: number | string;
  playsinline?: boolean;
  poster?: string;
  width?: number | string;
  disablePictureInPicture?: boolean;
  disableRemotePlayback?: boolean;
}

// The three broad type categories are (in order of restrictiveness):
//   - "number | string"
//   - "string"
//   - union of string literals
export interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
  // Attributes which also defined in HTMLAttributes
  class?: string;
  color?: string;
  height?: number | string;
  id?: string;
  lang?: string;
  max?: number | string;
  media?: string;
  method?: string;
  min?: number | string;
  name?: string;
  style?: string;
  target?: string;
  type?: string;
  width?: number | string;

  // Other HTML properties supported by SVG elements in browsers
  role?: AriaRole;
  tabindex?: number;
  crossorigin?: true | 'anonymous' | 'use-credentials' | '';

  // SVG Specific attributes
  contentScriptType?: number | string;
  contentStyleType?: number | string;
  cursor?: number | string;
  display?: number | string;
  fill?: string;
  filter?: string;
  mask?: string;
  opacity?: number | string;
  preserveAspectRatio?: string;
  requiredExtensions?: number | string;
  stroke?: string;
  systemLanguage?: number | string;
  transform?: string;
  viewBox?: string;
  visibility?: number | string;
  x?: number | string;
  xmlns?: string;
  y?: number | string;
}

export type ElementTagHTMLAttributes = AllHTMLAttributes<'div'> & {
  tag?: string;
};

type ExoticElements = Record<string, DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>;

declare global {
  namespace JSX {
    type Element = NullstackNode;

    interface IntrinsicAttributes extends NullstackAttributes { }
    interface IntrinsicClassAttributes extends ClassAttributes { }

    interface AllElements {
      // HTML
      a: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
      abbr: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      address: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      area: DetailedHTMLProps<AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
      article: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      aside: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      audio: DetailedHTMLProps<AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
      b: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      base: DetailedHTMLProps<BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
      bdi: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      bdo: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      big: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      blockquote: DetailedHTMLProps<BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
      body: DetailedHTMLProps<HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
      br: DetailedHTMLProps<HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
      button: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      canvas: DetailedHTMLProps<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
      caption: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      cite: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      code: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      col: DetailedHTMLProps<ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
      colgroup: DetailedHTMLProps<ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
      data: DetailedHTMLProps<DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
      datalist: DetailedHTMLProps<HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
      dd: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      del: DetailedHTMLProps<DelHTMLAttributes<HTMLModElement>, HTMLModElement>;
      details: DetailedHTMLProps<DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>;
      dfn: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      dialog: DetailedHTMLProps<DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
      div: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      dl: DetailedHTMLProps<HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
      dt: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      em: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      embed: DetailedHTMLProps<EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
      fieldset: DetailedHTMLProps<FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
      figcaption: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      figure: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      footer: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      form: DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
      h1: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h2: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h3: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h4: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h5: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h6: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      head: DetailedHTMLProps<HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
      header: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      hgroup: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      hr: DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
      html: DetailedHTMLProps<HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
      i: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      iframe: DetailedHTMLProps<IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
      img: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
      input: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      ins: DetailedHTMLProps<InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
      kbd: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      /** @deprecated */
      keygen: DetailedHTMLProps<KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
      label: DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
      legend: DetailedHTMLProps<HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
      li: DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
      link: DetailedHTMLProps<LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
      main: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      map: DetailedHTMLProps<MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
      mark: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      menu: DetailedHTMLProps<MenuHTMLAttributes<HTMLElement>, HTMLElement>;
      menuitem: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      meta: DetailedHTMLProps<MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
      meter: DetailedHTMLProps<MeterHTMLAttributes<HTMLMeterElement>, HTMLMeterElement>;
      nav: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      noindex: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      noscript: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      object: DetailedHTMLProps<ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
      ol: DetailedHTMLProps<OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
      optgroup: DetailedHTMLProps<OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
      option: DetailedHTMLProps<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
      output: DetailedHTMLProps<OutputHTMLAttributes<HTMLOutputElement>, HTMLOutputElement>;
      p: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      param: DetailedHTMLProps<ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
      picture: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      pre: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
      progress: DetailedHTMLProps<ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
      q: DetailedHTMLProps<QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
      rp: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      rt: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      ruby: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      s: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      samp: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      slot: DetailedHTMLProps<SlotHTMLAttributes<HTMLSlotElement>, HTMLSlotElement>;
      script: DetailedHTMLProps<ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
      section: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      select: DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
      small: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      source: DetailedHTMLProps<SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
      span: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      strong: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      style: DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
      sub: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      summary: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      sup: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      table: DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
      template: DetailedHTMLProps<HTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>;
      tbody: DetailedHTMLProps<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      td: DetailedHTMLProps<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
      textarea: DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
      tfoot: DetailedHTMLProps<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      th: DetailedHTMLProps<ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
      thead: DetailedHTMLProps<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      time: DetailedHTMLProps<TimeHTMLAttributes<HTMLTimeElement>, HTMLTimeElement>;
      title: DetailedHTMLProps<HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
      tr: DetailedHTMLProps<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
      track: DetailedHTMLProps<TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
      u: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      ul: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
      var: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      video: DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
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

    interface IntrinsicElements extends ExoticElements, AllElements { }
  }
}
