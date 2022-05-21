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

type NativeDragEvent = DragEvent;
type NativeFocusEvent = FocusEvent;
type NativeKeyboardEvent = KeyboardEvent;
type NativeMouseEvent = MouseEvent;
type NativePointerEvent = PointerEvent;
type NativeUIEvent = UIEvent;
type NativeWheelEvent = WheelEvent;
type Booleanish = boolean | 'true' | 'false';

export interface ComponentLifecycle {
    /**
     * @see https://nullstack.app/full-stack-lifecycle#prepare
     */
    prepare?(context?: Record<string, any>): any

    /**
     * @see https://nullstack.app/full-stack-lifecycle#initiate
     */
    initiate?(context?: Record<string, any>): any

    /**
     * @see https://nullstack.app/full-stack-lifecycle#launch
     */
    launch?(context?: Record<string, any>): any

    /**
     * @see https://nullstack.app/full-stack-lifecycle#hydrate
     */
    hydrate?(context?: Record<string, any>): any

    /**
     * @see https://nullstack.app/full-stack-lifecycle#update
     */
    update?(context?: Record<string, any>): any

    /**
     * @see https://nullstack.app/full-stack-lifecycle#terminate
     */
    terminate?(context?: Record<string, any>): any
}

export namespace N {
    //
    // Nullstack Elements
    // ----------------------------------------------------------------------

    interface Attributes {
        html?: string | undefined;
        source?: object | undefined;
        bind?: any | undefined;
        data?: object | undefined;
        'data-'?: any;
        [key: string]: any;
    }

    interface NullstackAttributes extends Attributes {
        children?: NullstackNode;
        route?: string | undefined;
        persistent?: boolean | undefined;
        key?: string;
    }

    interface ClassAttributes extends Attributes { }

    //
    // Factories
    // ----------------------------------------------------------------------

    type DetailedHTMLFactory<P, T = any> = P;

    interface SVGFactory { }

    type NullstackFragment = NullstackNode[];
    type NullstackNode = NullstackFragment | string | number | boolean | null | undefined;

    //
    // Event System
    // ----------------------------------------------------------------------
    // TODO: change any to unknown when moving to TS v3
    interface BaseSyntheticEvent<E = object, C = any, T = any> {
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
    interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}

    interface DragEvent<T = Element> extends MouseEvent<T, NativeDragEvent> {
        dataTransfer: DataTransfer;
    }

    interface PointerEvent<T = Element> extends MouseEvent<T, NativePointerEvent> {
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

    interface FocusEvent<Target = Element, RelatedTarget = Element> extends SyntheticEvent<Target, NativeFocusEvent> {
        relatedTarget: (EventTarget & RelatedTarget) | null;
        target: EventTarget & Target;
    }

    interface FormEvent<T = Element> extends SyntheticEvent<T> {
    }

    interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
        target: EventTarget & T;
    }

    interface KeyboardEvent<T = Element> extends UIEvent<T, NativeKeyboardEvent> {
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

    interface MouseEvent<T = Element, E = NativeMouseEvent> extends UIEvent<T, E> {
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

    interface UIEvent<T = Element, E = NativeUIEvent> extends SyntheticEvent<T, E> {
        detail: number;
    }

    interface WheelEvent<T = Element> extends MouseEvent<T, NativeWheelEvent> {
        deltaMode: number;
        deltaX: number;
        deltaY: number;
        deltaZ: number;
    }

    //
    // Event Handler Types
    // ----------------------------------------------------------------------

    type EventHandler<E extends SyntheticEvent<any>> = object | {
        bivarianceHack(event: { event: E } & NullstackClientContext): void
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

    interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes { }

    interface DOMAttributes<T> extends Attributes {
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
    interface AriaAttributes {
        /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
        'aria-activedescendant'?: string | undefined;
        /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
        'aria-atomic'?: Booleanish | undefined;
        /**
         * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
         * presented if they are made.
         */
        'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both' | undefined;
        /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
        'aria-busy'?: Booleanish | undefined;
        /**
         * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
         * @see aria-pressed @see aria-selected.
         */
        'aria-checked'?: boolean | 'false' | 'mixed' | 'true' | undefined;
        /**
         * Defines the total number of columns in a table, grid, or treegrid.
         * @see aria-colindex.
         */
        'aria-colcount'?: number | undefined;
        /**
         * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
         * @see aria-colcount @see aria-colspan.
         */
        'aria-colindex'?: number | undefined;
        /**
         * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
         * @see aria-colindex @see aria-rowspan.
         */
        'aria-colspan'?: number | undefined;
        /**
         * Identifies the element (or elements) whose contents or presence are controlled by the current element.
         * @see aria-owns.
         */
        'aria-controls'?: string | undefined;
        /** Indicates the element that represents the current item within a container or set of related elements. */
        'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time' | undefined;
        /**
         * Identifies the element (or elements) that describes the object.
         * @see aria-labelledby
         */
        'aria-describedby'?: string | undefined;
        /**
         * Identifies the element that provides a detailed, extended description for the object.
         * @see aria-describedby.
         */
        'aria-details'?: string | undefined;
        /**
         * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
         * @see aria-hidden @see aria-readonly.
         */
        'aria-disabled'?: Booleanish | undefined;
        /**
         * Indicates what functions can be performed when a dragged object is released on the drop target.
         * @deprecated in ARIA 1.1
         */
        'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup' | undefined;
        /**
         * Identifies the element that provides an error message for the object.
         * @see aria-invalid @see aria-describedby.
         */
        'aria-errormessage'?: string | undefined;
        /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
        'aria-expanded'?: Booleanish | undefined;
        /**
         * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
         * allows assistive technology to override the general default of reading in document source order.
         */
        'aria-flowto'?: string | undefined;
        /**
         * Indicates an element's "grabbed" state in a drag-and-drop operation.
         * @deprecated in ARIA 1.1
         */
        'aria-grabbed'?: Booleanish | undefined;
        /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
        'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | undefined;
        /**
         * Indicates whether the element is exposed to an accessibility API.
         * @see aria-disabled.
         */
        'aria-hidden'?: Booleanish | undefined;
        /**
         * Indicates the entered value does not conform to the format expected by the application.
         * @see aria-errormessage.
         */
        'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling' | undefined;
        /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
        'aria-keyshortcuts'?: string | undefined;
        /**
         * Defines a string value that labels the current element.
         * @see aria-labelledby.
         */
        'aria-label'?: string | undefined;
        /**
         * Identifies the element (or elements) that labels the current element.
         * @see aria-describedby.
         */
        'aria-labelledby'?: string | undefined;
        /** Defines the hierarchical level of an element within a structure. */
        'aria-level'?: number | undefined;
        /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
        'aria-live'?: 'off' | 'assertive' | 'polite' | undefined;
        /** Indicates whether an element is modal when displayed. */
        'aria-modal'?: Booleanish | undefined;
        /** Indicates whether a text box accepts multiple lines of input or only a single line. */
        'aria-multiline'?: Booleanish | undefined;
        /** Indicates that the user may select more than one item from the current selectable descendants. */
        'aria-multiselectable'?: Booleanish | undefined;
        /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
        'aria-orientation'?: 'horizontal' | 'vertical' | undefined;
        /**
         * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
         * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
         * @see aria-controls.
         */
        'aria-owns'?: string | undefined;
        /**
         * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
         * A hint could be a sample value or a brief description of the expected format.
         */
        'aria-placeholder'?: string | undefined;
        /**
         * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
         * @see aria-setsize.
         */
        'aria-posinset'?: number | undefined;
        /**
         * Indicates the current "pressed" state of toggle buttons.
         * @see aria-checked @see aria-selected.
         */
        'aria-pressed'?: boolean | 'false' | 'mixed' | 'true' | undefined;
        /**
         * Indicates that the element is not editable, but is otherwise operable.
         * @see aria-disabled.
         */
        'aria-readonly'?: Booleanish | undefined;
        /**
         * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
         * @see aria-atomic.
         */
        'aria-relevant'?: 'additions' | 'additions removals' | 'additions text' | 'all' | 'removals' | 'removals additions' | 'removals text' | 'text' | 'text additions' | 'text removals' | undefined;
        /** Indicates that user input is required on the element before a form may be submitted. */
        'aria-required'?: Booleanish | undefined;
        /** Defines a human-readable, author-localized description for the role of an element. */
        'aria-roledescription'?: string | undefined;
        /**
         * Defines the total number of rows in a table, grid, or treegrid.
         * @see aria-rowindex.
         */
        'aria-rowcount'?: number | undefined;
        /**
         * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
         * @see aria-rowcount @see aria-rowspan.
         */
        'aria-rowindex'?: number | undefined;
        /**
         * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
         * @see aria-rowindex @see aria-colspan.
         */
        'aria-rowspan'?: number | undefined;
        /**
         * Indicates the current "selected" state of various widgets.
         * @see aria-checked @see aria-pressed.
         */
        'aria-selected'?: Booleanish | undefined;
        /**
         * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
         * @see aria-posinset.
         */
        'aria-setsize'?: number | undefined;
        /** Indicates if items in a table or grid are sorted in ascending or descending order. */
        'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other' | undefined;
        /** Defines the maximum allowed value for a range widget. */
        'aria-valuemax'?: number | undefined;
        /** Defines the minimum allowed value for a range widget. */
        'aria-valuemin'?: number | undefined;
        /**
         * Defines the current value for a range widget.
         * @see aria-valuetext.
         */
        'aria-valuenow'?: number | undefined;
        /** Defines the human readable text alternative of aria-valuenow for a range widget. */
        'aria-valuetext'?: string | undefined;
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

    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
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
        style?: object | undefined;
        tabindex?: number | string | undefined;
        title?: string | undefined;
        translate?: 'yes' | 'no' | undefined;

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
         * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
         */
        inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | undefined;
        /**
         * Specify that a standard HTML element should behave like a defined custom built-in element
         * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
         */
        is?: string | undefined;
    }

    interface AllHTMLAttributes<T> extends HTMLAttributes<T> {
        // Standard HTML Attributes
        accept?: string | undefined;
        'accept-charset'?: string | undefined;
        action?: string | undefined;
        allowfullScreen?: boolean | undefined;
        allowTransparency?: boolean | undefined;
        alt?: string | undefined;
        as?: string | undefined;
        async?: boolean | undefined;
        autocomplete?: string | undefined;
        autofocus?: boolean | undefined;
        autoplay?: boolean | undefined;
        capture?: boolean | 'user' | 'environment' | undefined;
        charset?: string | undefined;
        checked?: boolean | undefined;
        cite?: string | undefined;
        classid?: string | undefined;
        cols?: number | undefined;
        colspan?: number | undefined;
        content?: string | undefined;
        controls?: boolean | undefined;
        coords?: string | undefined;
        crossorigin?: string | undefined;
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
        'http-equiv'?: string | undefined;
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
        | ''
        | 'no-referrer'
        | 'no-referrer-when-downgrade'
        | 'origin'
        | 'origin-when-cross-origin'
        | 'same-origin'
        | 'strict-origin'
        | 'strict-origin-when-cross-origin'
        | 'unsafe-url';

    type HTMLAttributeAnchorTarget =
        | '_self'
        | '_blank'
        | '_parent'
        | '_top'
        | (string & {});

    interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
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

    interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

    interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
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

    interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
        href?: string | undefined;
        target?: string | undefined;
    }

    interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | undefined;
    }

    interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
        autofocus?: boolean | undefined;
        disabled?: boolean | undefined;
        form?: string | undefined;
        formaction?: string | undefined;
        formenctype?: string | undefined;
        formmethod?: string | undefined;
        formnovalidate?: boolean | undefined;
        formtarget?: string | undefined;
        name?: string | undefined;
        type?: 'submit' | 'reset' | 'button' | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string | undefined;
        width?: number | string | undefined;
    }

    interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
        span?: number | undefined;
        /** @deprecated */
        width?: number | string | undefined;
    }

    interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
        span?: number | undefined;
    }

    interface DataHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
        open?: boolean | undefined;
    }

    interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | undefined;
        datetime?: string | undefined;
    }

    interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
        open?: boolean | undefined;
    }

    interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string | undefined;
        src?: string | undefined;
        type?: string | undefined;
        width?: number | string | undefined;
    }

    interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean | undefined;
        form?: string | undefined;
        name?: string | undefined;
    }

    interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
        'accept-charset'?: string | undefined;
        action?: string | undefined;
        autocomplete?: string | undefined;
        enctype?: string | undefined;
        method?: string | undefined;
        name?: string | undefined;
        novalidate?: boolean | undefined;
        target?: string | undefined;
    }

    interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
        manifest?: string | undefined;
    }

    interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
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

    interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
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

    interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | undefined;
        datetime?: string | undefined;
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

    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        accept?: string | undefined;
        alt?: string | undefined;
        autocomplete?: string | undefined;
        autofocus?: boolean | undefined;
        /** @see https://www.w3.org/TR/html-media-capture/#the-capture-attribute */
        capture?: boolean | 'user' | 'environment' | undefined;
        checked?: boolean | undefined;
        crossorigin?: string | undefined;
        disabled?: boolean | undefined;
        enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | undefined;
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

    interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
        autofocus?: boolean | undefined;
        challenge?: string | undefined;
        disabled?: boolean | undefined;
        form?: string | undefined;
        keytype?: string | undefined;
        keyparams?: string | undefined;
        name?: string | undefined;
    }

    interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string | undefined;
    }

    interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
        as?: string | undefined;
        crossorigin?: string | undefined;
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

    interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string | undefined;
    }

    interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
        type?: string | undefined;
    }

    interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoplay?: boolean | undefined;
        controls?: boolean | undefined;
        crossorigin?: string | undefined;
        loop?: boolean | undefined;
        mediagroup?: string | undefined;
        muted?: boolean | undefined;
        playsinline?: boolean | undefined;
        preload?: string | undefined;
        src?: string | undefined;
    }

    interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
        charset?: string | undefined;
        content?: string | undefined;
        'http-equiv'?: string | undefined;
        name?: string | undefined;
        media?: string | undefined;
    }

    interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string | undefined;
        high?: number | undefined;
        low?: number | undefined;
        max?: number | string | undefined;
        min?: number | string | undefined;
        optimum?: number | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | undefined;
    }

    interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
        classid?: string | undefined;
        form?: string | undefined;
        height?: number | string | undefined;
        name?: string | undefined;
        type?: string | undefined;
        usemap?: string | undefined;
        width?: number | string | undefined;
    }

    interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
        reversed?: boolean | undefined;
        start?: number | undefined;
        type?: '1' | 'a' | 'A' | 'i' | 'I' | undefined;
    }

    interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean | undefined;
        label?: string | undefined;
    }

    interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean | undefined;
        label?: string | undefined;
        selected?: boolean | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string | undefined;
        name?: string | undefined;
    }

    interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
        max?: number | string | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface SlotHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string | undefined;
    }

    interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
        async?: boolean | undefined;
        /** @deprecated */
        charset?: string | undefined;
        crossorigin?: string | undefined;
        defer?: boolean | undefined;
        integrity?: string | undefined;
        nomodule?: boolean | undefined;
        nonce?: string | undefined;
        referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
        src?: string | undefined;
        type?: string | undefined;
    }

    interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
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

    interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string | undefined;
        media?: string | undefined;
        sizes?: string | undefined;
        src?: string | undefined;
        srcset?: string | undefined;
        type?: string | undefined;
        width?: number | string | undefined;
    }

    interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
        media?: string | undefined;
        nonce?: string | undefined;
        scoped?: boolean | undefined;
        type?: string | undefined;
    }

    interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
        summary?: string | undefined;
        width?: number | string | undefined;
    }

    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
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

    interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: "left" | "center" | "right" | "justify" | "char" | undefined;
        colspan?: number | undefined;
        headers?: string | undefined;
        rowspan?: number | undefined;
        scope?: string | undefined;
        abbr?: string | undefined;
        height?: number | string | undefined;
        width?: number | string | undefined;
    }

    interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: "left" | "center" | "right" | "justify" | "char" | undefined;
        colspan?: number | undefined;
        headers?: string | undefined;
        rowspan?: number | undefined;
        scope?: string | undefined;
        abbr?: string | undefined;
    }

    interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
        datetime?: string | undefined;
    }

    interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
        default?: boolean | undefined;
        kind?: string | undefined;
        label?: string | undefined;
        src?: string | undefined;
        srclang?: string | undefined;
    }

    interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
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
    interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
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
        style?: object | undefined;
        target?: string | undefined;
        type?: string | undefined;
        width?: number | string | undefined;

        // Other HTML properties supported by SVG elements in browsers
        role?: AriaRole | undefined;
        tabindex?: number | undefined;
        crossorigin?: "anonymous" | "use-credentials" | "" | undefined;

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

    type ElementTagHTMLAttributes = AllHTMLAttributes<'div'> & {
        tag?: string
    }
}

type ExoticElements = Record<string, N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>>

declare global {
    namespace JSX {
        type Element = N.NullstackNode;

        interface IntrinsicAttributes extends N.NullstackAttributes { }
        interface IntrinsicClassAttributes extends N.ClassAttributes { }

        interface IntrinsicElements {
            // HTML
            a: N.DetailedHTMLProps<N.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
            abbr: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            address: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            area: N.DetailedHTMLProps<N.AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
            article: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            aside: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            audio: N.DetailedHTMLProps<N.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
            b: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            base: N.DetailedHTMLProps<N.BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
            bdi: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            bdo: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            big: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            blockquote: N.DetailedHTMLProps<N.BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
            body: N.DetailedHTMLProps<N.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
            br: N.DetailedHTMLProps<N.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
            button: N.DetailedHTMLProps<N.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
            canvas: N.DetailedHTMLProps<N.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
            caption: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            cite: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            code: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            col: N.DetailedHTMLProps<N.ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
            colgroup: N.DetailedHTMLProps<N.ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
            data: N.DetailedHTMLProps<N.DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
            datalist: N.DetailedHTMLProps<N.HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
            dd: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            del: N.DetailedHTMLProps<N.DelHTMLAttributes<HTMLModElement>, HTMLModElement>;
            details: N.DetailedHTMLProps<N.DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>;
            dfn: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            dialog: N.DetailedHTMLProps<N.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
            div: N.DetailedHTMLProps<N.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
            dl: N.DetailedHTMLProps<N.HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
            dt: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            em: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            embed: N.DetailedHTMLProps<N.EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
            fieldset: N.DetailedHTMLProps<N.FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
            figcaption: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            figure: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            footer: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            form: N.DetailedHTMLProps<N.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
            h1: N.DetailedHTMLProps<N.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h2: N.DetailedHTMLProps<N.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h3: N.DetailedHTMLProps<N.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h4: N.DetailedHTMLProps<N.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h5: N.DetailedHTMLProps<N.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h6: N.DetailedHTMLProps<N.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            head: N.DetailedHTMLProps<N.HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
            header: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            hgroup: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            hr: N.DetailedHTMLProps<N.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
            html: N.DetailedHTMLProps<N.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
            i: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            iframe: N.DetailedHTMLProps<N.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
            img: N.DetailedHTMLProps<N.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
            input: N.DetailedHTMLProps<N.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
            ins: N.DetailedHTMLProps<N.InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
            kbd: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            /** @deprecated */
            keygen: N.DetailedHTMLProps<N.KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
            label: N.DetailedHTMLProps<N.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
            legend: N.DetailedHTMLProps<N.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
            li: N.DetailedHTMLProps<N.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
            link: N.DetailedHTMLProps<N.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
            main: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            map: N.DetailedHTMLProps<N.MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
            mark: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            menu: N.DetailedHTMLProps<N.MenuHTMLAttributes<HTMLElement>, HTMLElement>;
            menuitem: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            meta: N.DetailedHTMLProps<N.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
            meter: N.DetailedHTMLProps<N.MeterHTMLAttributes<HTMLMeterElement>, HTMLMeterElement>;
            nav: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            noindex: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            noscript: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            object: N.DetailedHTMLProps<N.ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
            ol: N.DetailedHTMLProps<N.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
            optgroup: N.DetailedHTMLProps<N.OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
            option: N.DetailedHTMLProps<N.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
            output: N.DetailedHTMLProps<N.OutputHTMLAttributes<HTMLOutputElement>, HTMLOutputElement>;
            p: N.DetailedHTMLProps<N.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
            param: N.DetailedHTMLProps<N.ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
            picture: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            pre: N.DetailedHTMLProps<N.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
            progress: N.DetailedHTMLProps<N.ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
            q: N.DetailedHTMLProps<N.QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
            rp: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            rt: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            ruby: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            s: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            samp: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            slot: N.DetailedHTMLProps<N.SlotHTMLAttributes<HTMLSlotElement>, HTMLSlotElement>;
            script: N.DetailedHTMLProps<N.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
            section: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            select: N.DetailedHTMLProps<N.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
            small: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            source: N.DetailedHTMLProps<N.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
            span: N.DetailedHTMLProps<N.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
            strong: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            style: N.DetailedHTMLProps<N.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
            sub: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            summary: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            sup: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            table: N.DetailedHTMLProps<N.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
            template: N.DetailedHTMLProps<N.HTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>;
            tbody: N.DetailedHTMLProps<N.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            td: N.DetailedHTMLProps<N.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
            textarea: N.DetailedHTMLProps<N.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
            tfoot: N.DetailedHTMLProps<N.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            th: N.DetailedHTMLProps<N.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
            thead: N.DetailedHTMLProps<N.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            time: N.DetailedHTMLProps<N.TimeHTMLAttributes<HTMLTimeElement>, HTMLTimeElement>;
            title: N.DetailedHTMLProps<N.HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
            tr: N.DetailedHTMLProps<N.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
            track: N.DetailedHTMLProps<N.TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
            u: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            ul: N.DetailedHTMLProps<N.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
            "var": N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;
            video: N.DetailedHTMLProps<N.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
            wbr: N.DetailedHTMLProps<N.HTMLAttributes<HTMLElement>, HTMLElement>;

            // SVG
            svg: N.SVGProps<SVGSVGElement>;

            animate: N.SVGProps<SVGElement>; // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
            animateMotion: N.SVGProps<SVGElement>;
            animateTransform: N.SVGProps<SVGElement>; // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
            circle: N.SVGProps<SVGCircleElement>;
            clipPath: N.SVGProps<SVGClipPathElement>;
            defs: N.SVGProps<SVGDefsElement>;
            desc: N.SVGProps<SVGDescElement>;
            ellipse: N.SVGProps<SVGEllipseElement>;
            feBlend: N.SVGProps<SVGFEBlendElement>;
            feColorMatrix: N.SVGProps<SVGFEColorMatrixElement>;
            feComponentTransfer: N.SVGProps<SVGFEComponentTransferElement>;
            feComposite: N.SVGProps<SVGFECompositeElement>;
            feConvolveMatrix: N.SVGProps<SVGFEConvolveMatrixElement>;
            feDiffuseLighting: N.SVGProps<SVGFEDiffuseLightingElement>;
            feDisplacementMap: N.SVGProps<SVGFEDisplacementMapElement>;
            feDistantLight: N.SVGProps<SVGFEDistantLightElement>;
            feDropShadow: N.SVGProps<SVGFEDropShadowElement>;
            feFlood: N.SVGProps<SVGFEFloodElement>;
            feFuncA: N.SVGProps<SVGFEFuncAElement>;
            feFuncB: N.SVGProps<SVGFEFuncBElement>;
            feFuncG: N.SVGProps<SVGFEFuncGElement>;
            feFuncR: N.SVGProps<SVGFEFuncRElement>;
            feGaussianBlur: N.SVGProps<SVGFEGaussianBlurElement>;
            feImage: N.SVGProps<SVGFEImageElement>;
            feMerge: N.SVGProps<SVGFEMergeElement>;
            feMergeNode: N.SVGProps<SVGFEMergeNodeElement>;
            feMorphology: N.SVGProps<SVGFEMorphologyElement>;
            feOffset: N.SVGProps<SVGFEOffsetElement>;
            fePointLight: N.SVGProps<SVGFEPointLightElement>;
            feSpecularLighting: N.SVGProps<SVGFESpecularLightingElement>;
            feSpotLight: N.SVGProps<SVGFESpotLightElement>;
            feTile: N.SVGProps<SVGFETileElement>;
            feTurbulence: N.SVGProps<SVGFETurbulenceElement>;
            filter: N.SVGProps<SVGFilterElement>;
            foreignObject: N.SVGProps<SVGForeignObjectElement>;
            g: N.SVGProps<SVGGElement>;
            image: N.SVGProps<SVGImageElement>;
            line: N.SVGProps<SVGLineElement>;
            linearGradient: N.SVGProps<SVGLinearGradientElement>;
            marker: N.SVGProps<SVGMarkerElement>;
            mask: N.SVGProps<SVGMaskElement>;
            metadata: N.SVGProps<SVGMetadataElement>;
            mpath: N.SVGProps<SVGElement>;
            path: N.SVGProps<SVGPathElement>;
            pattern: N.SVGProps<SVGPatternElement>;
            polygon: N.SVGProps<SVGPolygonElement>;
            polyline: N.SVGProps<SVGPolylineElement>;
            radialGradient: N.SVGProps<SVGRadialGradientElement>;
            rect: N.SVGProps<SVGRectElement>;
            stop: N.SVGProps<SVGStopElement>;
            switch: N.SVGProps<SVGSwitchElement>;
            symbol: N.SVGProps<SVGSymbolElement>;
            text: N.SVGProps<SVGTextElement>;
            textPath: N.SVGProps<SVGTextPathElement>;
            tspan: N.SVGProps<SVGTSpanElement>;
            use: N.SVGProps<SVGUseElement>;
            view: N.SVGProps<SVGViewElement>;
            element: N.ElementTagHTMLAttributes;
        }
    }
}
