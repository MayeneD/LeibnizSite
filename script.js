
const wrapper = document.getElementById('carrossel-wrapper');

if (wrapper) {
  let slides = Array.from(document.querySelectorAll('.slide'));

  let currentIndex = 1;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;
  let autoSlideInterval;

  function cloneSlides() {
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');
    wrapper.appendChild(firstClone);
    wrapper.insertBefore(lastClone, slides[0]);
    slides = Array.from(document.querySelectorAll('.slide'));
  }

  function getSlideWidth() {
    return slides[0].clientWidth;
  }

  function setPosition() {
    wrapper.style.transform = `translateX(${currentTranslate}px)`;
  }

  function animation() {
    setPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  function setSlidePosition(jump = false) {
    const slideWidth = getSlideWidth();
    currentTranslate = currentIndex * -slideWidth;
    prevTranslate = currentTranslate;
    if (jump) {
      wrapper.style.transition = "none";
    } else {
      wrapper.style.transition = "transform 0.4s ease-in-out";
    }
    setPosition();
  }

  function checkInfiniteLoop() {
    if (slides[currentIndex].classList.contains('clone')) {
      wrapper.style.transition = 'none';
      currentIndex = currentIndex === 0 ? slides.length - 2 : 1;
      setTimeout(() => {
        setSlidePosition(true);
      }, 50);
    }
  }

  function setupCarousel() {
    cloneSlides();
    setSlidePosition(true);
    startAutoSlide();
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
      } else {
        currentIndex = 1;
      }
      setSlidePosition();
    }, 15000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Mouse events
  wrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - wrapper.offsetLeft;
    animationID = requestAnimationFrame(animation);
  });

  wrapper.addEventListener('mouseup', () => {
    isDragging = false;
    cancelAnimationFrame(animationID);
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex++;
    if (movedBy > 100 && currentIndex > 0) currentIndex--;

    setSlidePosition();
    startAutoSlide();
  });

  wrapper.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      cancelAnimationFrame(animationID);
      setSlidePosition();
    }
  });

  wrapper.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const currentX = e.pageX - wrapper.offsetLeft;
    const moveX = prevTranslate + currentX - startX;
    const maxTranslate = 0;
    const minTranslate = -(slides.length - 1) * getSlideWidth();
    currentTranslate = Math.max(Math.min(moveX, maxTranslate), minTranslate);
  });

  // Touch events
  wrapper.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDragging = true;
    startX = e.touches[0].clientX;
    animationID = requestAnimationFrame(animation);
    stopAutoSlide();
  }, { passive: false });

  wrapper.addEventListener('touchend', () => {
    isDragging = false;
    cancelAnimationFrame(animationID);
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex++;
    if (movedBy > 100 && currentIndex > 0) currentIndex--;

    setSlidePosition();
    startAutoSlide();
  });

  wrapper.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const moveX = prevTranslate + currentX - startX;
    const maxTranslate = 0;
    const minTranslate = -(slides.length - 1) * getSlideWidth();
    currentTranslate = Math.max(Math.min(moveX, maxTranslate), minTranslate);
  });

  wrapper.addEventListener('transitionend', checkInfiniteLoop);

  window.addEventListener('resize', () => {
    setSlidePosition(true);
  });

  window.addEventListener('load', setupCarousel);
}



const topBar = document.querySelector('.top-bar');
const menuContainer = document.querySelector('.menu-container');

if (menuContainer) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      menuContainer.classList.add('navbar-scrolled');
    } else {
      menuContainer.classList.remove('navbar-scrolled');
    }

    if (topBar) {
      if (window.scrollY > 0) {
        topBar.style.top = '-100px';
        menuContainer.style.top = '0';
      } else {
        topBar.style.top = '0';
        menuContainer.style.top = '40px';
      }
    }
  });
}

window.addEventListener('load', () => {
  const menuContainer = document.querySelector('.menu-container');
  if (window.scrollY > 50) {
    menuContainer.classList.add('navbar-scrolled');
  } else {
    menuContainer.classList.remove('navbar-scrolled');
  }
});
