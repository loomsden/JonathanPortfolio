//import { shouldReduceMotion } from './animate-on-scroll'
//import { attr, controller, target } from '@github/catalyst'

//@controller
<script>
class CardSkewElement extends HTMLElement {
    skewSpeed = 0.15 // How fast the skew moves towards the mouse, 1 = instantly
    moveSpeed = 0.9 // How fast the shine moves towards the mouse, 1 = instantly
    snapThreshold = 0.005 // How close a value to be to the target before it snaps to it (prevents endless animations)
    isMobileDevice = /Mobi/i.test(window.navigator.userAgent)
    rect = {} as DOMRect
    boundingElement = this as HTMLElement

    animationTargets = {
        x: 0,
        y: 0,
        skewX: 0,
        skewY: 0,
        shouldAnimate: false,
    }

    currentState = {
        x: 0,
        y: 0,
        skewX: 0,
        skewY: 0,
        isAnimating: false,
    }

    perspective = 700
    disableSkew = false

    bounding: HTMLElement
    shine: HTMLElement

    // Use `connectedCallback` instead of the constructor and initialize whatever you like. Invoked each time the custom element is appended into a document-connected element. This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
    // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks
    connectedCallback() {
        if (!this.isConnected) return
        //if (shouldReduceMotion(this) || this.isMobileDevice) return

        this.boundingElement = this.bounding || this
        this.rect = this.boundingElement.getBoundingClientRect()

        this.addEventListener('mousemove', this.mousemove)
        this.addEventListener('mouseleave', this.mouseleave)
    }

    mousemove(e: MouseEvent) {
        if (this.animationTargets.shouldAnimate === false) {
            this.rect = this.boundingElement.getBoundingClientRect()
        }

        this.animationTargets.shouldAnimate = true
        // Calculate mouse position relative to the card
        this.animationTargets.x = this.shine
            ? this.rect.width - (e.clientX - this.rect.left) - this.shine.offsetWidth / 2
            : 0
        this.animationTargets.y = this.shine
            ? this.rect.height - (e.clientY - this.rect.top) - this.shine.offsetHeight / 2
            : 0
        this.animationTargets.skewY = !this.disableSkew
            ? -((e.clientX - this.rect.left - this.rect.width / 2) / this.rect.width) * 3
            : 0
        this.animationTargets.skewX = !this.disableSkew
            ? ((e.clientY - this.rect.top - this.rect.height / 2) / this.rect.height) * 2
            : 0
        // Handle if the mouseenter event never fired
        if (this.currentState.isAnimating === false) {
            this.currentState.isAnimating = true
            this.animationTargets.shouldAnimate = true
            window.requestAnimationFrame(this.animateTowardsTarget.bind(this))
        }
    }

    mouseleave() {
        this.animationTargets.skewX = 0
        this.animationTargets.skewY = 0
        this.animationTargets.shouldAnimate = false
    }

    animateTowardsTarget() {
        // Set the shine element's position through top and left CSS properties
        // Create a slight delay by going *towards* the target, rather than snapping to it
        this.currentState.x = this.shine
            ? this.goTowardsValue(this.currentState.x, this.animationTargets.x, this.moveSpeed)
            : 0
        this.currentState.y = this.shine
            ? this.goTowardsValue(this.currentState.y, this.animationTargets.y, this.moveSpeed)
            : 0
        this.currentState.skewX = !this.disableSkew
            ? this.goTowardsValue(this.currentState.skewX, this.animationTargets.skewX, this.skewSpeed)
            : 0
        this.currentState.skewY = !this.disableSkew
            ? this.goTowardsValue(this.currentState.skewY, this.animationTargets.skewY, this.skewSpeed)
            : 0

        // Stop if we're really close to all targets
        if (
            Math.abs(this.animationTargets.x - this.currentState.x) < this.snapThreshold &&
            Math.abs(this.animationTargets.y - this.currentState.y) < this.snapThreshold &&
            Math.abs(this.animationTargets.skewX - this.currentState.skewX) < this.snapThreshold &&
            Math.abs(this.animationTargets.skewY - this.currentState.skewY) < this.snapThreshold &&
            this.animationTargets.shouldAnimate === false
        ) {
            this.currentState.isAnimating = false
            return
        }

        if (this.shine)
            this.shine.style.setProperty('transform', `translate(${-this.currentState.x}px, ${-this.currentState.y / 2}px)`)
        if (!this.disableSkew)
            this.style.setProperty(
                'transform',
                `perspective(${this.perspective}px) rotateX(${Math.round(this.currentState.skewX * 100) / 100}deg) rotateY(${Math.round(this.currentState.skewY * 100) / 100
                }deg)`,
            )

        window.requestAnimationFrame(this.animateTowardsTarget.bind(this))
    }

    goTowardsValue(current: number, to: number, speed: number) {
        return Math.round((current + (to - current) * speed) * 100) / 100
    } 
}
customElements.define('skew-card', CardSkewElement);
</script>