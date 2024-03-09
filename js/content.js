document.addEventListener("DOMContentLoaded", () => {
  const infoParagraph1 = document.querySelector("p.info1"); // Select the info paragraph
  const infoParagraph2 = document.querySelector("p.info2"); // Select the info paragraph
  const infoParagraph3 = document.querySelector("p.info3"); // Select the info paragraph
  // const infoParagraph4 = document.querySelector("p.info4"); // Select the info paragraph
  const sections = document.querySelectorAll("section"); // Select all sections
  console.log(window.devicePixelRatio);

  function updateInfoText() {
    let closestSection = null;
    let smallestDistance = Infinity;

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top; // Distance from the top of the viewport
      const sectionHeight = section.offsetHeight;
      const distance = Math.abs(sectionTop); // Absolute distance to handle both directions

      // Check if this section is closer to the top of the viewport than the previous closest
      if (distance < smallestDistance && sectionTop < sectionHeight / 2) {
        closestSection = section;
        smallestDistance = distance;
      }
    });

    // Update the info paragraph with the id of the closest section, if a section was found
    if (closestSection.id === "one") {
      infoParagraph1.innerHTML = `<a class='link2' href='https://www.concordia.ca/academics/undergraduate/comp-arts-computer-science.html'> Specialization in Computation Arts </a>`;
      infoParagraph2.innerHTML = `<a class='link2' href='https://www.briqueparbrique.com/'> Intern at Brique par brique </a>`;
      infoParagraph3.innerHTML = `<a class='link2' href='assets/pdfs/Resume_Arman.pdf' download='Resume_Arman.pdf'>Download Resume</a>`;
      // infoParagraph4.innerHTML = "";
    } else if (closestSection.id === "two") {
      infoParagraph1.innerHTML = `<a class='link2' href='https://www.linkedin.com/in/arman-faruqui-696811240/'> Linkedin </a>   . <a class='link2' href='https://github.com/armanfaruqui'>  Github </a>   .    Blog`;
      infoParagraph2.innerHTML = `<span id="show">Technical and Software Skills </span>`;
      infoParagraph3.innerHTML = `<a class='link2' href='assets/pdfs/Resume_Arman.pdf' download='Resume_Arman.pdf'>Download Resume</a>`;
      // infoParagraph4.innerHTML = ``;
    } else {
      infoParagraph1.innerHTML = ``;
      infoParagraph2.innerHTML = ``;
      infoParagraph3.innerHTML = ``;
    }
  }

  // Listen for scroll events on the window
  window.addEventListener("scroll", updateInfoText);
});

document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav li[data-target]");
  const sections = document.querySelectorAll("section[id]");

  const observer = new IntersectionObserver(
    (entries) => {
      let anySectionIntersecting = false;

      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        const correspondingNavItem = document.querySelector(
          `.nav li[data-target="${id}"]`
        );

        if (entry.isIntersecting) {
          anySectionIntersecting = true;
          if (correspondingNavItem) {
            correspondingNavItem.classList.add("active");
          }
        } else {
          if (correspondingNavItem) {
            correspondingNavItem.classList.remove("active");
          }
        }
      });

      // If no sections are intersecting, we are at the top - remove all active classes
      if (!anySectionIntersecting) {
        navItems.forEach((item) => item.classList.remove("active"));
      }
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));

  // Additional logic to handle scrolling near the top of the page
  document.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    // Threshold set to 100px, adjust based on your layout
    if (scrollPosition < 100) {
      navItems.forEach((item) => item.classList.remove("active"));
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Use the document as the event listener target for delegation
  document.addEventListener(
    "mouseenter",
    function (event) {
      // Check if the mouseenter target is the #show element
      if (event.target.id === "show") {
        document.querySelectorAll(".about").forEach(function (p) {
          p.style.display = "none";
        });
        document.querySelectorAll(".extra-container").forEach(function (p) {
          p.style.display = "flex"; // Change this to flex to display its children side by side
        });
      }
    },
    true // Use capture mode to ensure the event is caught as it's capturing down
  );

  document.addEventListener(
    "mouseleave",
    function (event) {
      if (event.target.id === "show") {
        document.querySelectorAll(".about").forEach(function (p) {
          p.style.display = "block";
        });
        document.querySelectorAll(".extra-container").forEach(function (p) {
          p.style.display = "none"; // Hide the extra-container again
        });
      }
    },
    true // Use capture mode for mouseleave as well
  );
});
