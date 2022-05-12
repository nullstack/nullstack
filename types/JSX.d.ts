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
// <reference path="CompGlobal.d.ts" />

import { NullstackClientContext, NullstackServerContext } from ".";

type NativeAnimationEvent = AnimationEvent;
type NativeClipboardEvent = ClipboardEvent;
type NativeCompositionEvent = CompositionEvent;
type NativeDragEvent = DragEvent;
type NativeFocusEvent = FocusEvent;
type NativeKeyboardEvent = KeyboardEvent;
type NativeMouseEvent = MouseEvent;
type NativePointerEvent = PointerEvent;
type NativeTransitionEvent = TransitionEvent;
type NativeUIEvent = UIEvent;
type NativeWheelEvent = WheelEvent;
type Booleanish = boolean | 'true' | 'false';
interface HTMLWebViewElement extends HTMLElement { }

export default Nullstack;
export as namespace Nullstack;

declare namespace Nullstack {
    //
    // Nullstack Elements
    // ----------------------------------------------------------------------

    type ElementType<P = any> =
        {
            [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never
        }[keyof JSX.IntrinsicElements] |
        ComponentType<P>;
    type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

    type JSXElementConstructor<P> =
        | ((props: P) => NullstackElement<any, any> | null)
        | (new (props: P) => Component<any>);

    interface RefObject<T> {
        readonly current: T | null;
    }
    // Bivariance hack for consistent unsoundness with RefObject
    type RefCallback<T> = { bivarianceHack(instance: T | null): void }["bivarianceHack"];
    type Ref<T> = RefCallback<T> | RefObject<T> | null;
    type LegacyRef<T> = string | Ref<T>;

    type ComponentState = any;

    type Key = string | number;

    /**
     * @internal You shouldn't need to use this type since you never see these attributes
     * inside your component or have to validate them.
     */
    interface Attributes {
        
    }
    interface ClassAttributes<T> extends Attributes {
        key?: Key | null | undefined;
        route?: string;
    }

    interface NullstackElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
        type: T;
        props: P;
        key: Key | null;
    }

    // string fallback for custom web-components
    interface DOMElement<P extends HTMLAttributes<T> | SVGAttributes<T>, T extends Element> extends NullstackElement<P, string> {
        ref: LegacyRef<T>;
    }

    // NullstackHTML for NullstackHTMLElement
    interface NullstackHTMLElement<T extends HTMLElement> extends DetailedNullstackHTMLElement<AllHTMLAttributes<T>, T> { }

    interface DetailedNullstackHTMLElement<P extends HTMLAttributes<T>, T extends HTMLElement> extends DOMElement<P, T> {
        type: keyof NullstackHTML;
    }

    // NullstackSVG for NullstackSVGElement
    interface NullstackSVGElement extends DOMElement<SVGAttributes<SVGElement>, SVGElement> {
        type: keyof NullstackSVG;
    }

    //
    // Factories
    // ----------------------------------------------------------------------

    type Factory<P> = (props?: Attributes & P, ...children: NullstackNode[]) => NullstackElement<P>;

    type DOMFactory<P extends DOMAttributes<T>, T extends Element> =
        (props?: ClassAttributes<T> & P | null, ...children: NullstackNode[]) => DOMElement<P, T>;

    interface HTMLFactory<T extends HTMLElement> extends DetailedHTMLFactory<AllHTMLAttributes<T>, T> {}

    interface DetailedHTMLFactory<P extends HTMLAttributes<T>, T extends HTMLElement> extends DOMFactory<P, T> {
        (props?: ClassAttributes<T> & P | null, ...children: NullstackNode[]): DetailedNullstackHTMLElement<P, T>;
    }

    interface SVGFactory extends DOMFactory<SVGAttributes<SVGElement>, SVGElement> {
        (props?: ClassAttributes<SVGElement> & SVGAttributes<SVGElement> | null, ...children: NullstackNode[]): NullstackSVGElement;
    }

    type NullstackFragment = Iterable<NullstackNode>;
    type NullstackNode = NullstackElement | string | number | NullstackFragment | boolean | null | undefined;

    //
    // Component API
    // ----------------------------------------------------------------------

    // Base component for plain JS classes
    interface Component<P = {}> extends ComponentLifecycle<P> { }
    class Component<P> {
        constructor(props: P);

        render(props: P): NullstackNode;
    }

    //
    // Class Interfaces
    // ----------------------------------------------------------------------

    interface FunctionComponent<P = {}> {
        (props: P, context?: any): NullstackElement<any, any> | null;
        propTypes?: object | undefined;
        contextTypes?: object | undefined;
        defaultProps?: Partial<P> | undefined;
        displayName?: string | undefined;
    }

    interface ComponentClass<P = {}> {
        new (props: P, context?: any): Component<P>;
        propTypes?: object | undefined;
        contextType?: object | undefined;
        contextTypes?: object | undefined;
        childContextTypes?: object | undefined;
        defaultProps?: Partial<P> | undefined;
        displayName?: string | undefined;
    }

    /**
     * We use an intersection type to infer multiple type parameters from
     * a single argument, which is useful for many top-level API defs.
     * See https://github.com/Microsoft/TypeScript/issues/7234 for more info.
     */
    type ClassType<P, T extends Component<P>, C extends ComponentClass<P>> =
        C &
        (new (props: P, context?: any) => T);

    //
    // Component Specs and Lifecycle
    // ----------------------------------------------------------------------

    type PropsContext<P> = NullstackClientContext & NullstackServerContext & P;
    interface ComponentLifecycle<P = {}> {
        /**
         * @see https://nullstack.app/full-stack-lifecycle#prepare
         */
        prepare?(context?: PropsContext<P>): any
        /**
         * @see https://nullstack.app/full-stack-lifecycle#initiate
         */
        initiate?(context?: PropsContext<P>): any

        /**
         * @see https://nullstack.app/full-stack-lifecycle#launch
         */
        launch?(context?: PropsContext<P>): any

        /**
         * @see https://nullstack.app/full-stack-lifecycle#hydrate
         */
        hydrate?(context?: PropsContext<P>): any

        /**
         * @see https://nullstack.app/full-stack-lifecycle#update
         */
        update?(context?: PropsContext<P>): any

        /**
         * @see https://nullstack.app/full-stack-lifecycle#terminate
         */
        terminate?(context?: PropsContext<P>): any
    }

    type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
        T extends JSXElementConstructor<infer P>
            ? P
            : T extends keyof JSX.IntrinsicElements
                ? JSX.IntrinsicElements[T]
                : {};

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
        isPropagationStopped(): boolean;
        persist(): void;
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

    interface ClipboardEvent<T = Element> extends SyntheticEvent<T, NativeClipboardEvent> {
        clipboardData: DataTransfer;
    }

    interface CompositionEvent<T = Element> extends SyntheticEvent<T, NativeCompositionEvent> {
        data: string;
    }

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

    interface InvalidEvent<T = Element> extends SyntheticEvent<T> {
        target: EventTarget & T;
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
        locale: string;
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

    interface AnimationEvent<T = Element> extends SyntheticEvent<T, NativeAnimationEvent> {
        animationName: string;
        elapsedTime: number;
        pseudoElement: string;
    }

    interface TransitionEvent<T = Element> extends SyntheticEvent<T, NativeTransitionEvent> {
        elapsedTime: number;
        propertyName: string;
        pseudoElement: string;
    }

    //
    // Event Handler Types
    // ----------------------------------------------------------------------

    type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];

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

    interface HTMLProps<T> extends AllHTMLAttributes<T>, ClassAttributes<T> {
    }

    type DetailedHTMLProps<E extends HTMLAttributes<T>, T> = E;

    interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {
    }

    interface DOMAttributes<T> {
        children?: NullstackNode | undefined;
        html?: string | undefined;

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
        // onencrypted?: NullstackEventHandler<T> | undefined;
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
        // onauxclick?: MouseEventHandler<T> | undefined;
        onclick?: MouseEventHandler<T> | undefined;
        oncontextmenu?: MouseEventHandler<T> | undefined;
        ondblclick?: MouseEventHandler<T> | undefined;
        ondrag?: DragEventHandler<T> | undefined;
        ondragend?: DragEventHandler<T> | undefined;
        ondragenter?: DragEventHandler<T> | undefined;
        // ondragexit?: DragEventHandler<T> | undefined;
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

        // Unknown
        // radioGroup?: string | undefined; // <command>, <menuitem>

        // WAI-ARIA
        role?: AriaRole | undefined;

        // RDFa Attributes
        about?: string | undefined;
        datatype?: string | undefined;
        inlist?: any;
        prefix?: string | undefined;
        property?: string | undefined;
        resource?: string | undefined;
        typeof?: string | undefined;
        vocab?: string | undefined;

        // Non-standard Attributes
        autoCapitalize?: string | undefined;
        // autoCorrect?: string | undefined;
        // autoSave?: string | undefined;
        // color?: string | undefined;
        itemprop?: string | undefined;
        itemscope?: boolean | undefined;
        itemtype?: string | undefined;
        itemid?: string | undefined;
        itemref?: string | undefined;
        // results?: number | undefined;
        // security?: string | undefined;
        // unselectable?: 'on' | 'off' | undefined;

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
        acceptCharset?: string | undefined;
        action?: string | undefined;
        allowFullScreen?: boolean | undefined;
        allowTransparency?: boolean | undefined;
        alt?: string | undefined;
        as?: string | undefined;
        async?: boolean | undefined;
        autoComplete?: string | undefined;
        autoFocus?: boolean | undefined;
        autoPlay?: boolean | undefined;
        capture?: boolean | 'user' | 'environment' | undefined;
        cellPadding?: number | string | undefined;
        cellSpacing?: number | string | undefined;
        charSet?: string | undefined;
        challenge?: string | undefined;
        checked?: boolean | undefined;
        cite?: string | undefined;
        classID?: string | undefined;
        cols?: number | undefined;
        colSpan?: number | undefined;
        content?: string | undefined;
        controls?: boolean | undefined;
        coords?: string | undefined;
        crossOrigin?: string | undefined;
        data?: string | undefined;
        dateTime?: string | undefined;
        default?: boolean | undefined;
        defer?: boolean | undefined;
        disabled?: boolean | undefined;
        download?: any;
        encType?: string | undefined;
        form?: string | undefined;
        formAction?: string | undefined;
        formEncType?: string | undefined;
        formMethod?: string | undefined;
        formNoValidate?: boolean | undefined;
        formTarget?: string | undefined;
        frameBorder?: number | string | undefined;
        headers?: string | undefined;
        height?: number | string | undefined;
        high?: number | undefined;
        href?: string | undefined;
        hrefLang?: string | undefined;
        htmlFor?: string | undefined;
        httpEquiv?: string | undefined;
        integrity?: string | undefined;
        keyParams?: string | undefined;
        keyType?: string | undefined;
        kind?: string | undefined;
        label?: string | undefined;
        list?: string | undefined;
        loop?: boolean | undefined;
        low?: number | undefined;
        manifest?: string | undefined;
        marginHeight?: number | undefined;
        marginWidth?: number | undefined;
        max?: number | string | undefined;
        maxLength?: number | undefined;
        media?: string | undefined;
        mediaGroup?: string | undefined;
        method?: string | undefined;
        min?: number | string | undefined;
        minLength?: number | undefined;
        multiple?: boolean | undefined;
        muted?: boolean | undefined;
        name?: string | undefined;
        nonce?: string | undefined;
        noValidate?: boolean | undefined;
        open?: boolean | undefined;
        optimum?: number | undefined;
        pattern?: string | undefined;
        placeholder?: string | undefined;
        playsInline?: boolean | undefined;
        poster?: string | undefined;
        preload?: string | undefined;
        readOnly?: boolean | undefined;
        rel?: string | undefined;
        required?: boolean | undefined;
        reversed?: boolean | undefined;
        rows?: number | undefined;
        rowSpan?: number | undefined;
        sandbox?: string | undefined;
        scope?: string | undefined;
        scoped?: boolean | undefined;
        scrolling?: string | undefined;
        seamless?: boolean | undefined;
        selected?: boolean | undefined;
        shape?: string | undefined;
        size?: number | undefined;
        sizes?: string | undefined;
        span?: number | undefined;
        src?: string | undefined;
        srcDoc?: string | undefined;
        srcLang?: string | undefined;
        srcSet?: string | undefined;
        start?: number | undefined;
        step?: number | string | undefined;
        summary?: string | undefined;
        target?: string | undefined;
        type?: string | undefined;
        useMap?: string | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
        width?: number | string | undefined;
        wmode?: string | undefined;
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
        hrefLang?: string | undefined;
        media?: string | undefined;
        ping?: string | undefined;
        rel?: string | undefined;
        target?: HTMLAttributeAnchorTarget | undefined;
        type?: string | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    }

    interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

    interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
        alt?: string | undefined;
        coords?: string | undefined;
        download?: any;
        href?: string | undefined;
        hrefLang?: string | undefined;
        media?: string | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
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
        autoFocus?: boolean | undefined;
        disabled?: boolean | undefined;
        form?: string | undefined;
        formAction?: string | undefined;
        formEncType?: string | undefined;
        formMethod?: string | undefined;
        formNoValidate?: boolean | undefined;
        formTarget?: string | undefined;
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
        onToggle?: NullstackEventHandler<T> | undefined;
    }

    interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | undefined;
        dateTime?: string | undefined;
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
        acceptCharset?: string | undefined;
        action?: string | undefined;
        autoComplete?: string | undefined;
        encType?: string | undefined;
        method?: string | undefined;
        name?: string | undefined;
        noValidate?: boolean | undefined;
        target?: string | undefined;
    }

    interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
        manifest?: string | undefined;
    }

    interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
        allow?: string | undefined;
        allowFullScreen?: boolean | undefined;
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
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
        sandbox?: string | undefined;
        /** @deprecated */
        scrolling?: string | undefined;
        seamless?: boolean | undefined;
        src?: string | undefined;
        srcDoc?: string | undefined;
        width?: number | string | undefined;
    }

    interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
        alt?: string | undefined;
        crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
        decoding?: "async" | "auto" | "sync" | undefined;
        height?: number | string | undefined;
        loading?: "eager" | "lazy" | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
        sizes?: string | undefined;
        src?: string | undefined;
        srcSet?: string | undefined;
        useMap?: string | undefined;
        width?: number | string | undefined;
    }

    interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | undefined;
        dateTime?: string | undefined;
    }

    type HTMLInputTypeAttribute =
        | 'button'
        | 'checkbox'
        | 'color'
        | 'date'
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
        autoComplete?: string | undefined;
        autoFocus?: boolean | undefined;
        capture?: boolean | 'user' | 'environment' | undefined; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
        checked?: boolean | undefined;
        crossOrigin?: string | undefined;
        disabled?: boolean | undefined;
        enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | undefined;
        form?: string | undefined;
        formAction?: string | undefined;
        formEncType?: string | undefined;
        formMethod?: string | undefined;
        formNoValidate?: boolean | undefined;
        formTarget?: string | undefined;
        height?: number | string | undefined;
        list?: string | undefined;
        max?: number | string | undefined;
        maxLength?: number | undefined;
        min?: number | string | undefined;
        minLength?: number | undefined;
        multiple?: boolean | undefined;
        name?: string | undefined;
        pattern?: string | undefined;
        placeholder?: string | undefined;
        readOnly?: boolean | undefined;
        required?: boolean | undefined;
        size?: number | undefined;
        src?: string | undefined;
        step?: number | string | undefined;
        type?: HTMLInputTypeAttribute | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
        width?: number | string | undefined;

        onChange?: ChangeEventHandler<T> | undefined;
    }

    interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: boolean | undefined;
        challenge?: string | undefined;
        disabled?: boolean | undefined;
        form?: string | undefined;
        keyType?: string | undefined;
        keyParams?: string | undefined;
        name?: string | undefined;
    }

    interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string | undefined;
        htmlFor?: string | undefined;
    }

    interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
        as?: string | undefined;
        crossOrigin?: string | undefined;
        href?: string | undefined;
        hrefLang?: string | undefined;
        integrity?: string | undefined;
        media?: string | undefined;
        imageSrcSet?: string | undefined;
        imageSizes?: string | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
        rel?: string | undefined;
        sizes?: string | undefined;
        type?: string | undefined;
        charSet?: string | undefined;
    }

    interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string | undefined;
    }

    interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
        type?: string | undefined;
    }

    interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoPlay?: boolean | undefined;
        controls?: boolean | undefined;
        controlsList?: string | undefined;
        crossOrigin?: string | undefined;
        loop?: boolean | undefined;
        mediaGroup?: string | undefined;
        muted?: boolean | undefined;
        playsInline?: boolean | undefined;
        preload?: string | undefined;
        src?: string | undefined;
    }

    interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
        charSet?: string | undefined;
        content?: string | undefined;
        httpEquiv?: string | undefined;
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
        classID?: string | undefined;
        data?: string | undefined;
        form?: string | undefined;
        height?: number | string | undefined;
        name?: string | undefined;
        type?: string | undefined;
        useMap?: string | undefined;
        width?: number | string | undefined;
        wmode?: string | undefined;
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
        htmlFor?: string | undefined;
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
        charSet?: string | undefined;
        crossOrigin?: string | undefined;
        defer?: boolean | undefined;
        integrity?: string | undefined;
        noModule?: boolean | undefined;
        nonce?: string | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
        src?: string | undefined;
        type?: string | undefined;
    }

    interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
        autoComplete?: string | undefined;
        autoFocus?: boolean | undefined;
        disabled?: boolean | undefined;
        form?: string | undefined;
        multiple?: boolean | undefined;
        name?: string | undefined;
        required?: boolean | undefined;
        size?: number | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
        onChange?: ChangeEventHandler<T> | undefined;
    }

    interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string | undefined;
        media?: string | undefined;
        sizes?: string | undefined;
        src?: string | undefined;
        srcSet?: string | undefined;
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
        cellPadding?: number | string | undefined;
        cellSpacing?: number | string | undefined;
        summary?: string | undefined;
        width?: number | string | undefined;
    }

    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoComplete?: string | undefined;
        autoFocus?: boolean | undefined;
        cols?: number | undefined;
        dirName?: string | undefined;
        disabled?: boolean | undefined;
        form?: string | undefined;
        maxLength?: number | undefined;
        minLength?: number | undefined;
        name?: string | undefined;
        placeholder?: string | undefined;
        readOnly?: boolean | undefined;
        required?: boolean | undefined;
        rows?: number | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
        wrap?: string | undefined;

        onChange?: ChangeEventHandler<T> | undefined;
    }

    interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: "left" | "center" | "right" | "justify" | "char" | undefined;
        colSpan?: number | undefined;
        headers?: string | undefined;
        rowSpan?: number | undefined;
        scope?: string | undefined;
        abbr?: string | undefined;
        height?: number | string | undefined;
        width?: number | string | undefined;
        valign?: "top" | "middle" | "bottom" | "baseline" | undefined;
    }

    interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: "left" | "center" | "right" | "justify" | "char" | undefined;
        colSpan?: number | undefined;
        headers?: string | undefined;
        rowSpan?: number | undefined;
        scope?: string | undefined;
        abbr?: string | undefined;
    }

    interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
        dateTime?: string | undefined;
    }

    interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
        default?: boolean | undefined;
        kind?: string | undefined;
        label?: string | undefined;
        src?: string | undefined;
        srcLang?: string | undefined;
    }

    interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
        height?: number | string | undefined;
        playsInline?: boolean | undefined;
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
        tabIndex?: number | undefined;
        crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;

        // SVG Specific attributes
        accentHeight?: number | string | undefined;
        accumulate?: "none" | "sum" | undefined;
        additive?: "replace" | "sum" | undefined;
        alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" |
        "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit" | undefined;
        allowReorder?: "no" | "yes" | undefined;
        alphabetic?: number | string | undefined;
        amplitude?: number | string | undefined;
        arabicForm?: "initial" | "medial" | "terminal" | "isolated" | undefined;
        ascent?: number | string | undefined;
        attributeName?: string | undefined;
        attributeType?: string | undefined;
        autoReverse?: Booleanish | undefined;
        azimuth?: number | string | undefined;
        baseFrequency?: number | string | undefined;
        baselineShift?: number | string | undefined;
        baseProfile?: number | string | undefined;
        bbox?: number | string | undefined;
        begin?: number | string | undefined;
        bias?: number | string | undefined;
        by?: number | string | undefined;
        calcMode?: number | string | undefined;
        capHeight?: number | string | undefined;
        clip?: number | string | undefined;
        clipPath?: string | undefined;
        clipPathUnits?: number | string | undefined;
        clipRule?: number | string | undefined;
        colorInterpolation?: number | string | undefined;
        colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit" | undefined;
        colorProfile?: number | string | undefined;
        colorRendering?: number | string | undefined;
        contentScriptType?: number | string | undefined;
        contentStyleType?: number | string | undefined;
        cursor?: number | string | undefined;
        cx?: number | string | undefined;
        cy?: number | string | undefined;
        d?: string | undefined;
        decelerate?: number | string | undefined;
        descent?: number | string | undefined;
        diffuseConstant?: number | string | undefined;
        direction?: number | string | undefined;
        display?: number | string | undefined;
        divisor?: number | string | undefined;
        dominantBaseline?: number | string | undefined;
        dur?: number | string | undefined;
        dx?: number | string | undefined;
        dy?: number | string | undefined;
        edgeMode?: number | string | undefined;
        elevation?: number | string | undefined;
        enableBackground?: number | string | undefined;
        end?: number | string | undefined;
        exponent?: number | string | undefined;
        externalResourcesRequired?: Booleanish | undefined;
        fill?: string | undefined;
        fillOpacity?: number | string | undefined;
        fillRule?: "nonzero" | "evenodd" | "inherit" | undefined;
        filter?: string | undefined;
        filterRes?: number | string | undefined;
        filterUnits?: number | string | undefined;
        floodColor?: number | string | undefined;
        floodOpacity?: number | string | undefined;
        focusable?: Booleanish | "auto" | undefined;
        fontFamily?: string | undefined;
        fontSize?: number | string | undefined;
        fontSizeAdjust?: number | string | undefined;
        fontStretch?: number | string | undefined;
        fontStyle?: number | string | undefined;
        fontVariant?: number | string | undefined;
        fontWeight?: number | string | undefined;
        format?: number | string | undefined;
        fr?: number | string | undefined;
        from?: number | string | undefined;
        fx?: number | string | undefined;
        fy?: number | string | undefined;
        g1?: number | string | undefined;
        g2?: number | string | undefined;
        glyphName?: number | string | undefined;
        glyphOrientationHorizontal?: number | string | undefined;
        glyphOrientationVertical?: number | string | undefined;
        glyphRef?: number | string | undefined;
        gradientTransform?: string | undefined;
        gradientUnits?: string | undefined;
        hanging?: number | string | undefined;
        horizAdvX?: number | string | undefined;
        horizOriginX?: number | string | undefined;
        href?: string | undefined;
        ideographic?: number | string | undefined;
        imageRendering?: number | string | undefined;
        in2?: number | string | undefined;
        in?: string | undefined;
        intercept?: number | string | undefined;
        k1?: number | string | undefined;
        k2?: number | string | undefined;
        k3?: number | string | undefined;
        k4?: number | string | undefined;
        k?: number | string | undefined;
        kernelMatrix?: number | string | undefined;
        kernelUnitLength?: number | string | undefined;
        kerning?: number | string | undefined;
        keyPoints?: number | string | undefined;
        keySplines?: number | string | undefined;
        keyTimes?: number | string | undefined;
        lengthAdjust?: number | string | undefined;
        letterSpacing?: number | string | undefined;
        lightingColor?: number | string | undefined;
        limitingConeAngle?: number | string | undefined;
        local?: number | string | undefined;
        markerEnd?: string | undefined;
        markerHeight?: number | string | undefined;
        markerMid?: string | undefined;
        markerStart?: string | undefined;
        markerUnits?: number | string | undefined;
        markerWidth?: number | string | undefined;
        mask?: string | undefined;
        maskContentUnits?: number | string | undefined;
        maskUnits?: number | string | undefined;
        mathematical?: number | string | undefined;
        mode?: number | string | undefined;
        numOctaves?: number | string | undefined;
        offset?: number | string | undefined;
        opacity?: number | string | undefined;
        operator?: number | string | undefined;
        order?: number | string | undefined;
        orient?: number | string | undefined;
        orientation?: number | string | undefined;
        origin?: number | string | undefined;
        overflow?: number | string | undefined;
        overlinePosition?: number | string | undefined;
        overlineThickness?: number | string | undefined;
        paintOrder?: number | string | undefined;
        panose1?: number | string | undefined;
        path?: string | undefined;
        pathLength?: number | string | undefined;
        patternContentUnits?: string | undefined;
        patternTransform?: number | string | undefined;
        patternUnits?: string | undefined;
        pointerEvents?: number | string | undefined;
        points?: string | undefined;
        pointsAtX?: number | string | undefined;
        pointsAtY?: number | string | undefined;
        pointsAtZ?: number | string | undefined;
        preserveAlpha?: Booleanish | undefined;
        preserveAspectRatio?: string | undefined;
        primitiveUnits?: number | string | undefined;
        r?: number | string | undefined;
        radius?: number | string | undefined;
        refX?: number | string | undefined;
        refY?: number | string | undefined;
        renderingIntent?: number | string | undefined;
        repeatCount?: number | string | undefined;
        repeatDur?: number | string | undefined;
        requiredExtensions?: number | string | undefined;
        requiredFeatures?: number | string | undefined;
        restart?: number | string | undefined;
        result?: string | undefined;
        rotate?: number | string | undefined;
        rx?: number | string | undefined;
        ry?: number | string | undefined;
        scale?: number | string | undefined;
        seed?: number | string | undefined;
        shapeRendering?: number | string | undefined;
        slope?: number | string | undefined;
        spacing?: number | string | undefined;
        specularConstant?: number | string | undefined;
        specularExponent?: number | string | undefined;
        speed?: number | string | undefined;
        spreadMethod?: string | undefined;
        startOffset?: number | string | undefined;
        stdDeviation?: number | string | undefined;
        stemh?: number | string | undefined;
        stemv?: number | string | undefined;
        stitchTiles?: number | string | undefined;
        stopColor?: string | undefined;
        stopOpacity?: number | string | undefined;
        strikethroughPosition?: number | string | undefined;
        strikethroughThickness?: number | string | undefined;
        string?: number | string | undefined;
        stroke?: string | undefined;
        strokeDasharray?: string | number | undefined;
        strokeDashoffset?: string | number | undefined;
        strokeLinecap?: "butt" | "round" | "square" | "inherit" | undefined;
        strokeLinejoin?: "miter" | "round" | "bevel" | "inherit" | undefined;
        strokeMiterlimit?: number | string | undefined;
        strokeOpacity?: number | string | undefined;
        strokeWidth?: number | string | undefined;
        surfaceScale?: number | string | undefined;
        systemLanguage?: number | string | undefined;
        tableValues?: number | string | undefined;
        targetX?: number | string | undefined;
        targetY?: number | string | undefined;
        textAnchor?: string | undefined;
        textDecoration?: number | string | undefined;
        textLength?: number | string | undefined;
        textRendering?: number | string | undefined;
        to?: number | string | undefined;
        transform?: string | undefined;
        u1?: number | string | undefined;
        u2?: number | string | undefined;
        underlinePosition?: number | string | undefined;
        underlineThickness?: number | string | undefined;
        unicode?: number | string | undefined;
        unicodeBidi?: number | string | undefined;
        unicodeRange?: number | string | undefined;
        unitsPerEm?: number | string | undefined;
        vAlphabetic?: number | string | undefined;
        values?: string | undefined;
        vectorEffect?: number | string | undefined;
        version?: string | undefined;
        vertAdvY?: number | string | undefined;
        vertOriginX?: number | string | undefined;
        vertOriginY?: number | string | undefined;
        vHanging?: number | string | undefined;
        vIdeographic?: number | string | undefined;
        viewBox?: string | undefined;
        viewTarget?: number | string | undefined;
        visibility?: number | string | undefined;
        vMathematical?: number | string | undefined;
        widths?: number | string | undefined;
        wordSpacing?: number | string | undefined;
        writingMode?: number | string | undefined;
        x1?: number | string | undefined;
        x2?: number | string | undefined;
        x?: number | string | undefined;
        xChannelSelector?: string | undefined;
        xHeight?: number | string | undefined;
        xlinkActuate?: string | undefined;
        xlinkArcrole?: string | undefined;
        xlinkHref?: string | undefined;
        xlinkRole?: string | undefined;
        xlinkShow?: string | undefined;
        xlinkTitle?: string | undefined;
        xlinkType?: string | undefined;
        xmlBase?: string | undefined;
        xmlLang?: string | undefined;
        xmlns?: string | undefined;
        xmlnsXlink?: string | undefined;
        xmlSpace?: string | undefined;
        y1?: number | string | undefined;
        y2?: number | string | undefined;
        y?: number | string | undefined;
        yChannelSelector?: string | undefined;
        z?: number | string | undefined;
        zoomAndPan?: string | undefined;
    }

    interface WebViewHTMLAttributes<T> extends HTMLAttributes<T> {
        allowFullScreen?: boolean | undefined;
        allowpopups?: boolean | undefined;
        autoFocus?: boolean | undefined;
        autosize?: boolean | undefined;
        blinkfeatures?: string | undefined;
        disableblinkfeatures?: string | undefined;
        disableguestresize?: boolean | undefined;
        disablewebsecurity?: boolean | undefined;
        guestinstance?: string | undefined;
        httpreferrer?: string | undefined;
        nodeintegration?: boolean | undefined;
        partition?: string | undefined;
        plugins?: boolean | undefined;
        preload?: string | undefined;
        src?: string | undefined;
        useragent?: string | undefined;
        webpreferences?: string | undefined;
    }

    //
    // Nullstack DOM
    // ----------------------------------------------------------------------

    interface NullstackHTML {
        a: DetailedHTMLFactory<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
        abbr: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        address: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        area: DetailedHTMLFactory<AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
        article: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        aside: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        audio: DetailedHTMLFactory<AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
        b: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        base: DetailedHTMLFactory<BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
        bdi: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        bdo: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        big: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        blockquote: DetailedHTMLFactory<BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
        body: DetailedHTMLFactory<HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
        br: DetailedHTMLFactory<HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
        button: DetailedHTMLFactory<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
        canvas: DetailedHTMLFactory<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
        caption: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        cite: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        code: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        col: DetailedHTMLFactory<ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
        colgroup: DetailedHTMLFactory<ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
        data: DetailedHTMLFactory<DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
        datalist: DetailedHTMLFactory<HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
        dd: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        del: DetailedHTMLFactory<DelHTMLAttributes<HTMLModElement>, HTMLModElement>;
        details: DetailedHTMLFactory<DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>;
        dfn: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        dialog: DetailedHTMLFactory<DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
        div: DetailedHTMLFactory<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
        dl: DetailedHTMLFactory<HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
        dt: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        em: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        embed: DetailedHTMLFactory<EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
        fieldset: DetailedHTMLFactory<FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
        figcaption: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        figure: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        footer: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        form: DetailedHTMLFactory<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
        h1: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h2: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h3: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h4: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h5: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h6: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        head: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLHeadElement>;
        header: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        hgroup: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        hr: DetailedHTMLFactory<HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
        html: DetailedHTMLFactory<HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
        i: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        iframe: DetailedHTMLFactory<IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
        img: DetailedHTMLFactory<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
        input: DetailedHTMLFactory<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
        ins: DetailedHTMLFactory<InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
        kbd: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        keygen: DetailedHTMLFactory<KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
        label: DetailedHTMLFactory<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
        legend: DetailedHTMLFactory<HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
        li: DetailedHTMLFactory<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
        link: DetailedHTMLFactory<LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
        main: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        map: DetailedHTMLFactory<MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
        mark: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        menu: DetailedHTMLFactory<MenuHTMLAttributes<HTMLElement>, HTMLElement>;
        menuitem: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        meta: DetailedHTMLFactory<MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
        meter: DetailedHTMLFactory<MeterHTMLAttributes<HTMLMeterElement>, HTMLMeterElement>;
        nav: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        noscript: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        object: DetailedHTMLFactory<ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
        ol: DetailedHTMLFactory<OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
        optgroup: DetailedHTMLFactory<OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
        option: DetailedHTMLFactory<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
        output: DetailedHTMLFactory<OutputHTMLAttributes<HTMLOutputElement>, HTMLOutputElement>;
        p: DetailedHTMLFactory<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
        param: DetailedHTMLFactory<ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
        picture: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        pre: DetailedHTMLFactory<HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
        progress: DetailedHTMLFactory<ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
        q: DetailedHTMLFactory<QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
        rp: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        rt: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        ruby: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        s: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        samp: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        slot: DetailedHTMLFactory<SlotHTMLAttributes<HTMLSlotElement>, HTMLSlotElement>;
        script: DetailedHTMLFactory<ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
        section: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        select: DetailedHTMLFactory<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
        small: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        source: DetailedHTMLFactory<SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
        span: DetailedHTMLFactory<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
        strong: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        style: DetailedHTMLFactory<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
        sub: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        summary: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        sup: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        table: DetailedHTMLFactory<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
        template: DetailedHTMLFactory<HTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>;
        tbody: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        td: DetailedHTMLFactory<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
        textarea: DetailedHTMLFactory<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
        tfoot: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        th: DetailedHTMLFactory<ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
        thead: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        time: DetailedHTMLFactory<TimeHTMLAttributes<HTMLTimeElement>, HTMLTimeElement>;
        title: DetailedHTMLFactory<HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
        tr: DetailedHTMLFactory<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
        track: DetailedHTMLFactory<TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
        u: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        ul: DetailedHTMLFactory<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
        "var": DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        video: DetailedHTMLFactory<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
        wbr: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        webview: DetailedHTMLFactory<WebViewHTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement>;
    }

    interface NullstackSVG {
        animate: SVGFactory;
        circle: SVGFactory;
        clipPath: SVGFactory;
        defs: SVGFactory;
        desc: SVGFactory;
        ellipse: SVGFactory;
        feBlend: SVGFactory;
        feColorMatrix: SVGFactory;
        feComponentTransfer: SVGFactory;
        feComposite: SVGFactory;
        feConvolveMatrix: SVGFactory;
        feDiffuseLighting: SVGFactory;
        feDisplacementMap: SVGFactory;
        feDistantLight: SVGFactory;
        feDropShadow: SVGFactory;
        feFlood: SVGFactory;
        feFuncA: SVGFactory;
        feFuncB: SVGFactory;
        feFuncG: SVGFactory;
        feFuncR: SVGFactory;
        feGaussianBlur: SVGFactory;
        feImage: SVGFactory;
        feMerge: SVGFactory;
        feMergeNode: SVGFactory;
        feMorphology: SVGFactory;
        feOffset: SVGFactory;
        fePointLight: SVGFactory;
        feSpecularLighting: SVGFactory;
        feSpotLight: SVGFactory;
        feTile: SVGFactory;
        feTurbulence: SVGFactory;
        filter: SVGFactory;
        foreignObject: SVGFactory;
        g: SVGFactory;
        image: SVGFactory;
        line: SVGFactory;
        linearGradient: SVGFactory;
        marker: SVGFactory;
        mask: SVGFactory;
        metadata: SVGFactory;
        path: SVGFactory;
        pattern: SVGFactory;
        polygon: SVGFactory;
        polyline: SVGFactory;
        radialGradient: SVGFactory;
        rect: SVGFactory;
        stop: SVGFactory;
        svg: SVGFactory;
        switch: SVGFactory;
        symbol: SVGFactory;
        text: SVGFactory;
        textPath: SVGFactory;
        tspan: SVGFactory;
        use: SVGFactory;
        view: SVGFactory;
    }

    interface NullstackDOM extends NullstackHTML, NullstackSVG { }

    //
    // Nullstack.Children
    // ----------------------------------------------------------------------

    /**
     * @deprecated - Use `typeof Nullstack.Children` instead.
     */
    // Sync with type of `const Children`.
    interface NullstackChildren {
        map<T, C>(children: C | ReadonlyArray<C>, fn: (child: C, index: number) => T):
            C extends null | undefined ? C : Array<Exclude<T, boolean | null | undefined>>;
        forEach<C>(children: C | ReadonlyArray<C>, fn: (child: C, index: number) => void): void;
        count(children: any): number;
        only<C>(children: C): C extends any[] ? never : C;
        toArray(children: NullstackNode | NullstackNode[]): Array<Exclude<NullstackNode, boolean | null | undefined>>;
    }
}

declare global {
    namespace JSX {
        interface Element extends Nullstack.NullstackElement<any, any> { }
        interface ElementClass extends Nullstack.Component<any> {
            render(): Nullstack.NullstackNode;
        }
        // interface ElementAttributesProperty { [key: string]: any }
        interface ElementChildrenAttribute { children: {}; }

        interface IntrinsicAttributes extends Nullstack.Attributes { }
        interface IntrinsicClassAttributes<T> extends Nullstack.ClassAttributes<T> { }

        interface IntrinsicElements {
            // HTML
            a: Nullstack.DetailedHTMLProps<Nullstack.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
            abbr: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            address: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            area: Nullstack.DetailedHTMLProps<Nullstack.AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
            article: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            aside: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            audio: Nullstack.DetailedHTMLProps<Nullstack.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
            b: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            base: Nullstack.DetailedHTMLProps<Nullstack.BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
            bdi: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            bdo: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            big: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            blockquote: Nullstack.DetailedHTMLProps<Nullstack.BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
            body: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
            br: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
            button: Nullstack.DetailedHTMLProps<Nullstack.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
            canvas: Nullstack.DetailedHTMLProps<Nullstack.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
            caption: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            cite: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            code: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            col: Nullstack.DetailedHTMLProps<Nullstack.ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
            colgroup: Nullstack.DetailedHTMLProps<Nullstack.ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
            data: Nullstack.DetailedHTMLProps<Nullstack.DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
            datalist: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
            dd: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            del: Nullstack.DetailedHTMLProps<Nullstack.DelHTMLAttributes<HTMLModElement>, HTMLModElement>;
            details: Nullstack.DetailedHTMLProps<Nullstack.DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>;
            dfn: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            dialog: Nullstack.DetailedHTMLProps<Nullstack.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
            div: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
            dl: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
            dt: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            em: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            embed: Nullstack.DetailedHTMLProps<Nullstack.EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
            fieldset: Nullstack.DetailedHTMLProps<Nullstack.FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
            figcaption: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            figure: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            footer: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            form: Nullstack.DetailedHTMLProps<Nullstack.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
            h1: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h2: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h3: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h4: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h5: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h6: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            head: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
            header: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            hgroup: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            hr: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
            html: Nullstack.DetailedHTMLProps<Nullstack.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
            i: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            iframe: Nullstack.DetailedHTMLProps<Nullstack.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
            img: Nullstack.DetailedHTMLProps<Nullstack.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
            input: Nullstack.DetailedHTMLProps<Nullstack.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
            ins: Nullstack.DetailedHTMLProps<Nullstack.InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
            kbd: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            keygen: Nullstack.DetailedHTMLProps<Nullstack.KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
            label: Nullstack.DetailedHTMLProps<Nullstack.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
            legend: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
            li: Nullstack.DetailedHTMLProps<Nullstack.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
            link: Nullstack.DetailedHTMLProps<Nullstack.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
            main: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            map: Nullstack.DetailedHTMLProps<Nullstack.MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
            mark: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            menu: Nullstack.DetailedHTMLProps<Nullstack.MenuHTMLAttributes<HTMLElement>, HTMLElement>;
            menuitem: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            meta: Nullstack.DetailedHTMLProps<Nullstack.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
            meter: Nullstack.DetailedHTMLProps<Nullstack.MeterHTMLAttributes<HTMLMeterElement>, HTMLMeterElement>;
            nav: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            noindex: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            noscript: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            object: Nullstack.DetailedHTMLProps<Nullstack.ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
            ol: Nullstack.DetailedHTMLProps<Nullstack.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
            optgroup: Nullstack.DetailedHTMLProps<Nullstack.OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
            option: Nullstack.DetailedHTMLProps<Nullstack.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
            output: Nullstack.DetailedHTMLProps<Nullstack.OutputHTMLAttributes<HTMLOutputElement>, HTMLOutputElement>;
            p: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
            param: Nullstack.DetailedHTMLProps<Nullstack.ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
            picture: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            pre: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
            progress: Nullstack.DetailedHTMLProps<Nullstack.ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
            q: Nullstack.DetailedHTMLProps<Nullstack.QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
            rp: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            rt: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            ruby: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            s: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            samp: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            slot: Nullstack.DetailedHTMLProps<Nullstack.SlotHTMLAttributes<HTMLSlotElement>, HTMLSlotElement>;
            script: Nullstack.DetailedHTMLProps<Nullstack.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
            section: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            select: Nullstack.DetailedHTMLProps<Nullstack.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
            small: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            source: Nullstack.DetailedHTMLProps<Nullstack.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
            span: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
            strong: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            style: Nullstack.DetailedHTMLProps<Nullstack.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
            sub: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            summary: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            sup: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            table: Nullstack.DetailedHTMLProps<Nullstack.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
            template: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>;
            tbody: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            td: Nullstack.DetailedHTMLProps<Nullstack.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
            textarea: Nullstack.DetailedHTMLProps<Nullstack.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
            tfoot: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            th: Nullstack.DetailedHTMLProps<Nullstack.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
            thead: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            time: Nullstack.DetailedHTMLProps<Nullstack.TimeHTMLAttributes<HTMLTimeElement>, HTMLTimeElement>;
            title: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
            tr: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
            track: Nullstack.DetailedHTMLProps<Nullstack.TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
            u: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            ul: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
            "var": Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            video: Nullstack.DetailedHTMLProps<Nullstack.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
            wbr: Nullstack.DetailedHTMLProps<Nullstack.HTMLAttributes<HTMLElement>, HTMLElement>;
            webview: Nullstack.DetailedHTMLProps<Nullstack.WebViewHTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement>;

            // SVG
            svg: Nullstack.SVGProps<SVGSVGElement>;

            animate: Nullstack.SVGProps<SVGElement>; // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
            animateMotion: Nullstack.SVGProps<SVGElement>;
            animateTransform: Nullstack.SVGProps<SVGElement>; // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
            circle: Nullstack.SVGProps<SVGCircleElement>;
            clipPath: Nullstack.SVGProps<SVGClipPathElement>;
            defs: Nullstack.SVGProps<SVGDefsElement>;
            desc: Nullstack.SVGProps<SVGDescElement>;
            ellipse: Nullstack.SVGProps<SVGEllipseElement>;
            feBlend: Nullstack.SVGProps<SVGFEBlendElement>;
            feColorMatrix: Nullstack.SVGProps<SVGFEColorMatrixElement>;
            feComponentTransfer: Nullstack.SVGProps<SVGFEComponentTransferElement>;
            feComposite: Nullstack.SVGProps<SVGFECompositeElement>;
            feConvolveMatrix: Nullstack.SVGProps<SVGFEConvolveMatrixElement>;
            feDiffuseLighting: Nullstack.SVGProps<SVGFEDiffuseLightingElement>;
            feDisplacementMap: Nullstack.SVGProps<SVGFEDisplacementMapElement>;
            feDistantLight: Nullstack.SVGProps<SVGFEDistantLightElement>;
            feDropShadow: Nullstack.SVGProps<SVGFEDropShadowElement>;
            feFlood: Nullstack.SVGProps<SVGFEFloodElement>;
            feFuncA: Nullstack.SVGProps<SVGFEFuncAElement>;
            feFuncB: Nullstack.SVGProps<SVGFEFuncBElement>;
            feFuncG: Nullstack.SVGProps<SVGFEFuncGElement>;
            feFuncR: Nullstack.SVGProps<SVGFEFuncRElement>;
            feGaussianBlur: Nullstack.SVGProps<SVGFEGaussianBlurElement>;
            feImage: Nullstack.SVGProps<SVGFEImageElement>;
            feMerge: Nullstack.SVGProps<SVGFEMergeElement>;
            feMergeNode: Nullstack.SVGProps<SVGFEMergeNodeElement>;
            feMorphology: Nullstack.SVGProps<SVGFEMorphologyElement>;
            feOffset: Nullstack.SVGProps<SVGFEOffsetElement>;
            fePointLight: Nullstack.SVGProps<SVGFEPointLightElement>;
            feSpecularLighting: Nullstack.SVGProps<SVGFESpecularLightingElement>;
            feSpotLight: Nullstack.SVGProps<SVGFESpotLightElement>;
            feTile: Nullstack.SVGProps<SVGFETileElement>;
            feTurbulence: Nullstack.SVGProps<SVGFETurbulenceElement>;
            filter: Nullstack.SVGProps<SVGFilterElement>;
            foreignObject: Nullstack.SVGProps<SVGForeignObjectElement>;
            g: Nullstack.SVGProps<SVGGElement>;
            image: Nullstack.SVGProps<SVGImageElement>;
            line: Nullstack.SVGProps<SVGLineElement>;
            linearGradient: Nullstack.SVGProps<SVGLinearGradientElement>;
            marker: Nullstack.SVGProps<SVGMarkerElement>;
            mask: Nullstack.SVGProps<SVGMaskElement>;
            metadata: Nullstack.SVGProps<SVGMetadataElement>;
            mpath: Nullstack.SVGProps<SVGElement>;
            path: Nullstack.SVGProps<SVGPathElement>;
            pattern: Nullstack.SVGProps<SVGPatternElement>;
            polygon: Nullstack.SVGProps<SVGPolygonElement>;
            polyline: Nullstack.SVGProps<SVGPolylineElement>;
            radialGradient: Nullstack.SVGProps<SVGRadialGradientElement>;
            rect: Nullstack.SVGProps<SVGRectElement>;
            stop: Nullstack.SVGProps<SVGStopElement>;
            switch: Nullstack.SVGProps<SVGSwitchElement>;
            symbol: Nullstack.SVGProps<SVGSymbolElement>;
            text: Nullstack.SVGProps<SVGTextElement>;
            textPath: Nullstack.SVGProps<SVGTextPathElement>;
            tspan: Nullstack.SVGProps<SVGTSpanElement>;
            use: Nullstack.SVGProps<SVGUseElement>;
            view: Nullstack.SVGProps<SVGViewElement>;
        }
    }
}
