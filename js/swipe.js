new Swiper("#swiper-1", {
  effect: "fade",
  navigation: {
    enabled: true,
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: "#swiper-1 .swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 1,
    stopOnLastSlide: true,
    disableOnInteraction: false,
  },
  on: {
    init: function () {
      this.autoplay.stop();
    },
  },
});

var webSwiper = new Swiper("#swiper-2", {
  effect: "fade",
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  loop: false,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  lazy: {
    loadPrevNext: true, // Optionally preloads the next and previous images
  },
  preloadImages: false, // Prevents preloading all images
  on: {
    init: function () {
      updateDescription.call(this, this.activeIndex);
    },
    slideChange: function () {
      updateDescription.call(this, this.activeIndex);
    },
  },
});

var artSwiper = new Swiper("#swiper-3", {
  effect: "fade",
  navigation: {
    enabled: true,
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  loop: false,
  pagination: {
    el: "#swiper-3 .swiper-pagination",
    clickable: true,
  },
  preloadImages: false, // Prevents preloading all images
  on: {
    init: function () {
      updateDescription.call(this, this.activeIndex);
    },
    slideChange: function () {
      updateDescription.call(this, this.activeIndex);
    },
  },
});

function updateDescription(index) {
  var swiperContainer = this.el; // Get the current Swiper container element.
  var descriptionId = swiperContainer.getAttribute("data-description-id"); // Get the ID for the description.
  var description = this.slides[index].getAttribute("data-description"); // Get the description from the current slide.
  document.getElementById(descriptionId).innerHTML = description; // Correctly set as innerHTML.
}
