if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.onload = () => {
  // Scroll to the top of the page when the window fully loads
  window.scrollTo(0, 0);
};

document.addEventListener("DOMContentLoaded", () => {
  if (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  ) {
    console.log("touch");
  }

  const sections = document.querySelectorAll("section");
  let isDown = false;
  let startY;
  let startScrollTop;

  // Define an offset to favor upward scrolling
  const upwardScrollOffset = 150; // Adjust this value to tweak sensitivity

  const logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("click", () => {
      const sectionOne = document.getElementById("one");
      if (sectionOne) {
        window.scrollTo({
          top: sectionOne.offsetTop, // Adjust if you have a fixed header or need some offset
          behavior: "smooth",
        });
        // Temporarily disable scroll snap to ensure smooth scrolling
        document.documentElement.style.scrollSnapType = "none";
        setTimeout(() => {
          // Re-enable scroll snap after the scroll
          document.documentElement.style.scrollSnapType = "y mandatory";
        }, 500); // Adjust this duration if needed
      }
    });
  }

  document.addEventListener("mousedown", (e) => {
    isDown = true;
    startY = e.clientY;
    startScrollTop = window.scrollY;
    document.documentElement.style.scrollSnapType = "none";
  });

  document.addEventListener("mouseup", () => {
    if (!isDown) return;
    isDown = false;
    const finalScrollTop = window.scrollY;
    scrollToClosestSection(startScrollTop, finalScrollTop);
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const y = e.clientY;
    const walk = (y - startY) * 2;
    window.scrollTo({ top: startScrollTop - walk, behavior: "auto" });
  });

  document.addEventListener("mouseleave", () => {
    if (isDown) {
      isDown = false;
      const finalScrollTop = window.scrollY;
      scrollToClosestSection(startScrollTop, finalScrollTop);
      document.documentElement.style.scrollSnapType = "y mandatory";
    }
  });

  function scrollToClosestSection(startScrollTop, finalScrollTop) {
    const direction = finalScrollTop > startScrollTop ? "down" : "up";
    let closestSection = null;
    let smallestDifference = Infinity;

    sections.forEach((section) => {
      let difference;
      if (direction === "down") {
        difference = section.offsetTop - finalScrollTop;
      } else {
        // Apply the upward scroll offset to make it favor scrolling up
        difference =
          finalScrollTop -
          (section.offsetTop + section.offsetHeight - window.innerHeight) -
          upwardScrollOffset;
      }

      if (
        (direction === "down" && difference >= 0) ||
        (direction === "up" && difference <= upwardScrollOffset)
      ) {
        const absoluteDifference = Math.abs(difference);
        if (absoluteDifference < smallestDifference) {
          smallestDifference = absoluteDifference;
          closestSection = section;
        }
      }
    });

    if (closestSection) {
      window.scrollTo({
        top:
          closestSection.offsetTop -
          (direction === "up"
            ? window.innerHeight - closestSection.offsetHeight
            : 0),
        behavior: "smooth",
      });

      setTimeout(() => {
        document.documentElement.style.scrollSnapType = "y mandatory";
      }, 500); // This timeout may need adjustment
    } else {
      document.documentElement.style.scrollSnapType = "y mandatory";
    }
  }

  const navItems = document.querySelectorAll(".nav li[data-target]");
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const targetSection = document.querySelector(`#${targetId}`);
      if (targetSection) {
        const sectionTop = targetSection.offsetTop - upwardScrollOffset; // Utilize your upwardScrollOffset if needed
        window.scrollTo({
          top: sectionTop,
          behavior: "smooth",
        });
        // Temporarily disable scroll snap to prevent conflict during manual scroll
        document.documentElement.style.scrollSnapType = "none";
        setTimeout(() => {
          // Re-enable scroll snap after scrolling
          document.documentElement.style.scrollSnapType = "y mandatory";
        }, 500); // Adjust timing based on your smooth scroll duration
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", (event) => {
  const circles = document.querySelectorAll(".circle");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          circles.forEach((circle) => {
            if (circle.getAttribute("data-target") === entry.target.id) {
              circle.classList.add("filled");
            } else {
              circle.classList.remove("filled");
            }
          });
        }
      });
    },
    { rootMargin: "-50% 0px -50% 0px" }
  );

  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section);
  });
});
