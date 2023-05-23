// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.\

// Clamp number between two values with the following line:


const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const clampAbs = (num, max) => Math.min(Math.max(num, -max), max);


class CardSkewElement extends HTMLElement {
    constructor() {
        super();

        this.classList.add("skew-container")
   
        let card = document.createElement('div')
        card.className = "skew-feature border"
        let shine = document.createElement('div')
        shine.className = "shine"
        card.appendChild(shine)
        card.append(...this.childNodes)
        this.appendChild(card)

        let constrain = 600;
        let mouseOverContainer = this;
        let maxAngle = 0.45;
        function transforms(x, y) {
            let box = mouseOverContainer.getBoundingClientRect();
            let calcX = clampAbs((y - box.y - (box.height / 2)) / constrain, maxAngle);
            let calcY = clampAbs(-(x - box.x - (box.width / 2)) / constrain, maxAngle);

            return "perspective(100px) "
                + "   rotateX(" + calcX + "deg) "
                + "   rotateY(" + calcY + "deg) ";
        };

        function shineLocation(x, y) {
            let box = mouseOverContainer.getBoundingClientRect();
            let calcX = x - box.left - (box.width / 2);
            let calcY = y - box.top - (box.height / 2);

            return "translate(" + (calcX) + "px," + (calcY) + "px)";
        }

        function transformElement(xy) {
            mouseOverContainer.style.transform = transforms.apply(null, xy);
            shine.style.transform = shineLocation.apply(null, xy);
        }

        mouseOverContainer.onmouseenter = function () {
            shine.style.opacity = "0.85";
        }

        mouseOverContainer.onmousemove = function (e) {
            let xy = [e.clientX, e.clientY];
            
            window.requestAnimationFrame(function () {
                transformElement(xy);
            });
        };

        mouseOverContainer.onmouseleave = function () {
            shine.style.opacity = "0";
            mouseOverContainer.style.transform = "perspective(100px) "
                + "   rotateX(0deg) "
                + "   rotateY(0deg) ";
        }
    } 
}

customElements.define("skew-card", CardSkewElement);

class ProjectCard extends HTMLElement {
    constructor() {
        super();

        this.className = ""

        const imgContainer = this.appendChild(document.createElement("div"))
        imgContainer.className = "project-img"
        const img = imgContainer.appendChild(document.createElement("img"));
        img.src = this.hasAttribute("img")
            ? this.getAttribute("img")
            : "~/images/default.png";
        // Always include descriptive text when adding an image
        img.alt = this.hasAttribute("alt") ? this.getAttribute("alt") : "";
        img.style.width = "100 %;"
        img.style.objectFit = "contain;"

        const title = this.appendChild(document.createElement("h1"));
        title.className = "project-title";
        title.textContent = this.hasAttribute("title") ? this.getAttribute("title") : "Title Here";

        const type = this.appendChild(document.createElement("h2"));
        type.className = "project-type";
        type.textContent = this.hasAttribute("type") ? this.getAttribute("type") : "Type Here";

        const description = this.appendChild(document.createElement("p"));
        description.className = "project-description";
        description.textContent = this.hasAttribute("description") ? this.getAttribute("description") : "description Here";
    }
}

customElements.define("project-card", ProjectCard);



/*----------------JS FOR TEST----------------*/

(function () {
    $(".flex-slide").each(function () {
        $(this).hover(function () {
            $(this).find('.flex-title').css({
                transform: 'rotate(0deg)',
                top: '10%'
            });
            $(this).find('.flex-about').css({
                opacity: '1'
            });
        }, function () {
            $(this).find('.flex-title').css({
                transform: 'rotate(90deg)',
                top: '15%'
            });
            $(this).find('.flex-about').css({
                opacity: '0'
            });
        })
    });
})();