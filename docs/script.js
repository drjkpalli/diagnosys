const body = document.querySelector("body");
const sidebarLinks = document.querySelectorAll("aside a");
const sideContent = document.querySelector(".side-content");
const modeSwitch = body.querySelector(".mode-button");
const mainContent = document.querySelector(".main-content");
const navLinks = document.querySelectorAll(".nav-links a");
let activeItem = null;
let activeSection = null;

// Add slide in/out animation along with making the side-content remain open/closed
sidebarLinks.forEach((link, index) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    // Check if the clicked link is already active
    const isActive = this.classList.contains("active");

    // Remove active class from all links
    sidebarLinks.forEach((link) => {
      link.classList.remove("active");
      // Restore item tooltip after second click of the same item
      link.setAttribute(
        "data-tooltip",
        link.getAttribute("data-original-tooltip")
      );
    });

    // Toggle active state
    if (!isActive) {
      this.classList.add("active");
      this.removeAttribute("data-tooltip"); // Remove tooltip when item becomes active

      if (!sideContent.classList.contains("show")) {
        sideContent.classList.add("show", "slide-in");
        sideContent.classList.remove("slide-out");
        mainContent.classList.add("shrink");
      } else {
        sideContent.classList.remove("slide-out");
        sideContent.classList.add("slide-in");
      }
      activeItem = this;
    } else {
      sideContent.classList.add("slide-out");
      sideContent.classList.remove("slide-in");
      mainContent.classList.remove("shrink");
      activeItem = null;
    }

    // Function to be called when the CSS animation ends
    function onAnimationEnd(event) {
      // Check if the animation that ended is the slide-out animation
      if (event.animationName === "slide-out") {
        // Remove the 'show' class when the slide-out animation ends
        sideContent.classList.remove("show");
      }
    }

    // Listen for the end of the CSS animation
    sideContent.addEventListener("animationend", onAnimationEnd);

    // Fade out the currently active section
    if (activeSection) {
      activeSection.classList.add("fade-out");
      activeSection.classList.remove("fade-in");

      activeSection.addEventListener("animationend", function fadeOutEnd() {
        activeSection.classList.remove("fade-out");
        activeSection.style.display = "none"; // Hide the section
        activeSection.removeEventListener("animationend", fadeOutEnd);

        // Show the target section after fade-out is complete
        const targetSection = document.querySelectorAll(
          ".side-content section"
        )[index];
        targetSection.classList.add("fade-in");
        targetSection.classList.remove("fade-out");
        targetSection.style.display = "block"; // Ensure the section is displayed
        activeSection = targetSection;
      });
    } else {
      // If no active section, directly show the target section
      const targetSection = document.querySelectorAll(".side-content section")[
        index
      ];
      targetSection.classList.add("fade-in");
      targetSection.classList.remove("fade-out");
      targetSection.style.display = "block"; // Ensure the section is displayed
      activeSection = targetSection;
    }
  });
});

// Function to toggle dark mode
modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");
});

// Function to handle tooltip visibility
function handleTooltipVisibility(event) {
  const hoveredLink = event.target.closest("a");
  const activeLink = document.querySelector("aside a.active");

  // Check if the hovered link is not active and is not already showing tooltip
  if (
    hoveredLink &&
    hoveredLink !== activeLink &&
    !hoveredLink.classList.contains("active")
  ) {
    // Show tooltip
    hoveredLink.setAttribute(
      "data-tooltip",
      hoveredLink.getAttribute("data-original-tooltip")
    );
  } else {
    // Hide tooltip
    sidebarLinks.forEach((link) => link.removeAttribute("data-tooltip"));
  }
}

// Add event listeners for hover and click events on sidebar links
sidebarLinks.forEach((link) => {
  // Save the original tooltip value
  link.setAttribute("data-original-tooltip", link.getAttribute("data-tooltip"));
  // Hover event listener
  link.addEventListener("mouseenter", handleTooltipVisibility);
});

// toggle the different nav-items to their corresponding section
// code for main content breathe in breathe out animation.
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll(".main-content-section");
  let activeMainSection = sections[0];
  activeMainSection.classList.add("active"); // Show the initial dashboard section

  function showMainSection(targetSectionId) {
    const targetSection = document.getElementById(targetSectionId);

    if (targetSection !== activeMainSection) {
      // Fade out the current section
      activeMainSection.classList.add("fade-out");

      // Listen for the end of the fade-out animation
      activeMainSection.addEventListener(
        "animationend",
        function onFadeOut() {
          activeMainSection.classList.remove("fade-out");
          activeMainSection.classList.remove("active");

          // Fade in the target section
          targetSection.classList.add("active");

          // Clean up the event listener
          activeMainSection.removeEventListener("animationend", onFadeOut);

          // Update the active section
          activeMainSection = targetSection;
        },
        { once: true }
      );
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetSectionId = link.getAttribute("href").substring(1);
      showMainSection(targetSectionId);

      // Update active link class
      navLinks.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Export the showSection function to be used outside this scope
  window.showMainSection = showMainSection;
});

function highlightNavLink(section) {
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => link.classList.remove("active"));
  const navLink = document.querySelector('nav a[href="#' + section + '"]');
  navLink.classList.add("active");
}

// hover parallax effect while hovering on the card
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dx = offsetX - centerX;
    const dy = offsetY - centerY;
    const tiltX = (dy / centerY) * 8; // Adjust the multiplier for the tilt effect
    const tiltY = -(dx / centerX) * 8; // Adjust the multiplier for the tilt effect
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(30px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "none";
  });
});

//  code for progress bar
const progressBar = document.querySelector(".progress-bar");
const markers = document.querySelectorAll(".marker");
const progress = document.querySelector(".progress");

let currentStep = 0; // Start at the first step

function updateProgressBar() {
  const progressActive = document.querySelector(".progress-active");
  if (progressActive) {
    progressActive.remove();
  }

  markers.forEach((marker, index) => {
    if (index == currentStep) {
      if (!marker.classList.contains("active")) {
        marker.classList.add("active");
      } else {
        marker.classList.remove("finished");
      }
    } else if (index < currentStep) {
      marker.classList.add("finished");
      if (markers[index + 1]) {
        progress.classList.add("active");
        markers[index + 1].classList.add("active");
      }
    } else {
      marker.classList.remove("active");
      marker.classList.remove("finished");
    }
  });

  const progressWidth = (currentStep / (markers.length - 1)) * 100;
  const progressActiveElement = document.createElement("div");
  progressActiveElement.classList.add("progress-active");
  progressActiveElement.style.width = `${progressWidth}%`;

  // Append the .progress-active element to the .progress element
  const progressElement = document.querySelector(".progress");
  progressElement.appendChild(progressActiveElement);
}

// Function to complete progress section, add event listeners to buttons to switch sections with validation
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".dash-content-section");
  const checkmarkContainer = document.querySelector(".checkmark-container");
  const buttons = {
    section1: document.querySelector("#complete-cc"),
    section2: document.querySelector("#complete-ac"),
    section3: document.querySelector("#complete-history"),
    section4: document.querySelector("#complete-pe"),
    section5: document.querySelector("#complete-labs"),
    section6: document.querySelector("#complete-imaging"),
    section7: document.querySelector("#complete-diagnosis"),
    section8: document.querySelector("#finish"),
    backToSection1: document.querySelector("#back-to-cc"),
    backToSection2: document.querySelector("#back-to-ac"),
    backToSection3: document.querySelector("#back-to-history"),
    backToSection4: document.querySelector("#back-to-pe"),
    backToSection5: document.querySelector("#back-to-labs"),
    backToSection6: document.querySelector("#back-to-imaging"),
    backToSection7: document.querySelector("#back-to-diagnosis"),
    backToSection8: document.querySelector("#back-to-treatment"),
  };

  // Function to show only one specific section at a time inside the "inside-content" div
  function showSection(sectionIndex) {
    const targetSection = sections[sectionIndex];
    const currentSection = document.querySelector(
      ".dash-content-section.active"
    );

    // If there's no current section (initial load), make the target section active without animation
    if (!currentSection) {
      targetSection.classList.add("active");
      return;
    }

    // Fade out all sections except the targeted one
    sections.forEach((section, index) => {
      if (index !== sectionIndex && section.classList.contains("active")) {
        section.classList.add("fade-out");
        section.addEventListener(
          "animationend",
          () => {
            // Remove "active" and "fade-out" classes after fade-out animation ends
            section.classList.remove("active", "fade-out");

            // After fade-out animation of inactive sections ends, fade in the target section
            if (section === currentSection) {
              targetSection.classList.remove("fade-out");
              targetSection.classList.add("active");
            }
          },
          { once: true }
        );
      }
    });

    // Fade out the current section (if not already faded out)
    if (currentSection !== targetSection) {
      currentSection.classList.add("fade-out");
    }
  }

  // Helper function to validate question responses in the dropdown menu
  function validateQuestions(section) {
    const questions = section.querySelectorAll(
      ".inside-content .question select"
    );
    let allAnswered = true;

    for (const dropdown of questions) {
      if (dropdown.value === "") {
        dropdown.classList.add("invalid");
        allAnswered = false;
      } else {
        dropdown.classList.remove("invalid");
      }
    }

    // Add a single event listener to the parent element
    section.addEventListener("change", (event) => {
      if (
        event.target.tagName === "SELECT" &&
        event.target.classList.contains("invalid")
      ) {
        event.target.classList.remove("invalid");
      }
    });

    return allAnswered;
  }

  // Function to mark a section as finished
  function markSectionAsFinished(sectionId) {
    const marker = document.querySelector(
      `.marker[data-section="${sectionId}"]`
    );
    if (marker) {
      marker.classList.add("finished");
    }
  }

  // Function to reset answers in subsequent progress sections
  function clearSubsequentSections(currentStep) {
    const sections = document.querySelectorAll(".dash-content-section");
    sections.forEach((section, index) => {
      if (index > currentStep) {
        const dropdowns = section.querySelectorAll("select");
        dropdowns.forEach((dropdown) => {
          const defaultValue = dropdown.querySelector("option[selected]");
          if (defaultValue) {
            dropdown.value = defaultValue.value;
          } else {
            dropdown.value = "";
          }
          dropdown.classList.remove("invalid");
        });
      }
    });
  }

  function handleSectionButtonClick(
    sectionIndex,
    sectionId,
    containerElementId,
    questionsUrl,
    isLastSection = false
  ) {
    const currentSection = sections[sectionIndex];

    if (!validateQuestions(currentSection)) {
      // alert(`Please answer all required questions in Section ${sectionIndex + 1}.`);
      return;
    }

    clearSubsequentSections(sectionIndex);
    markSectionAsFinished(sectionId);
    currentStep = sectionIndex + 1;

    if (!isLastSection) {
      renderQuestions(questionsUrl, containerElementId);
      updateProgressBar();
    } else {
      checkmarkContainer.classList.add("animate");

      // Trigger confetti after the checkmark appears
      setTimeout(() => {
        confetti({
          particleCount: 100, // Number of confetti particles
          spread: 100, // How far out the confetti spreads, in degrees
          origin: { x: 0.53, y: 0.7 }, // The starting point of the confetti, relative to the page height
          scalar: 0.5, // Size of the confetti (smaller number = smaller confetti)
        });
      }, 1700);
    }

    showSection(sectionIndex + 1);
  }

  // Populate questions and update progress bar for the first section on initial page load
  renderQuestions("http://localhost:8000/cc", "questions-container1");
  showSection(0);
  updateProgressBar();

  // Add event listeners to buttons to switch sections with validation
  buttons.section1.addEventListener("click", () => {
    handleSectionButtonClick(
      0,
      "section1",
      "questions-container2",
      "http://localhost:8000/ac"
    );
  });

  buttons.section2.addEventListener("click", () => {
    handleSectionButtonClick(
      1,
      "section2",
      "questions-container3",
      "http://localhost:8000/questions"
    );
  });

  buttons.section3.addEventListener("click", () => {
    handleSectionButtonClick(
      2,
      "section3",
      "questions-container4",
      "http://localhost:8000/questions"
    );
  });

  buttons.section4.addEventListener("click", () => {
    handleSectionButtonClick(
      3,
      "section4",
      "questions-container5",
      "http://localhost:8000/questions"
    );
  });

  buttons.section5.addEventListener("click", () => {
    handleSectionButtonClick(
      4,
      "section5",
      "questions-container6",
      "http://localhost:8000/questions"
    );
  });

  buttons.section6.addEventListener("click", () => {
    handleSectionButtonClick(
      5,
      "section6",
      "questions-container7",
      "http://localhost:8000/questions"
    );
  });

  buttons.section7.addEventListener("click", () => {
    handleSectionButtonClick(
      6,
      "section7",
      "questions-container8",
      "http://localhost:8000/questions"
    );
  });

  buttons.section8.addEventListener("click", () => {
    handleSectionButtonClick(
      7,
      "section8",
      "questions-container9",
      "http://localhost:8000/questions",
      true
    );
  });

  // Add event listeners to back buttons to go to previous sections
  buttons.backToSection1.addEventListener("click", () => {
    currentStep = 0;
    showSection(0);
    updateProgressBar();
  });
  buttons.backToSection2.addEventListener("click", () => {
    currentStep = 1;
    showSection(1);
    updateProgressBar();
  });
  buttons.backToSection3.addEventListener("click", () => {
    currentStep = 2;
    showSection(2);
    updateProgressBar();
  });
  buttons.backToSection4.addEventListener("click", () => {
    currentStep = 3;
    showSection(3);
    updateProgressBar();
  });
  buttons.backToSection5.addEventListener("click", () => {
    currentStep = 4;
    showSection(4);
    updateProgressBar();
  });
  buttons.backToSection6.addEventListener("click", () => {
    currentStep = 5;
    showSection(5);
    updateProgressBar();
  });
  buttons.backToSection7.addEventListener("click", () => {
    currentStep = 6;
    showSection(6);
    updateProgressBar();
  });
  buttons.backToSection8.addEventListener("click", () => {
    currentStep = 7;
    showSection(7);
    updateProgressBar();
  });
});

// Function to render questions in a specific container
function renderQuestions(url, containerId) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const questionsContainer = document.getElementById(containerId);
      questionsContainer.innerHTML = ""; // Clear existing content

      data.forEach((question, index) => {
        const questionDiv = createQuestionElement(question, index);
        questionsContainer.appendChild(questionDiv);
      });
    })
    .catch((error) => console.error("Error fetching questions:", error));
}

// Helper function to create the question element structure
function createQuestionElement(question, index) {
  const questionDiv = document.createElement("div");
  questionDiv.classList.add("question");

  const label = document.createElement("label");
  label.setAttribute("for", `question${index + 1}`);
  label.textContent = question.question;
  questionDiv.appendChild(label);

  const select = document.createElement("select");
  select.id = `question${index + 1}`;
  select.name = `question${index + 1}`;

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an option";
  select.appendChild(defaultOption);

  question.options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option.toLowerCase();
    optionElement.textContent = option;
    if (question.default && question.default.includes(option)) {
      optionElement.selected = true;
    }
    select.appendChild(optionElement);
  });

  questionDiv.appendChild(select);

  return questionDiv;
}

// Function for login and sign Up form submission
document.addEventListener("DOMContentLoaded", function () {
  // Signup form submission
  document
    .getElementById("signup-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("signup-name").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      // Perform validation or send data to the server
      console.log("Sign Up:", { name, email, password });

      // Clear the form
      this.reset();

      alert("Signup successful!");
    });

  // Login form submission
  document
    .getElementById("login-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      // Perform validation or send data to the server
      console.log("Login:", { email, password });

      // Clear the form
      this.reset();

      alert("Login successful!");
    });

  // Event listener for "Already have an account? Login" link
  const signupSection = document.getElementById("signup");
  const loginLink = signupSection.querySelector(".account a");
  loginLink.addEventListener("click", function (event) {
    event.preventDefault();
    showMainSection("login");
    highlightNavLink("login");
  });

  // Event listener for "Don't have an account? Sign Up" link
  const loginSection = document.getElementById("login");
  const signupLink = loginSection.querySelector(".no-account a");
  signupLink.addEventListener("click", function (event) {
    event.preventDefault();
    showMainSection("signup");
    highlightNavLink("signup");
  });
});

// Keyboard shortcuts
document.addEventListener("keydown", function (event) {
  if (!event.ctrlKey && !event.metaKey) {
    switch (event.key) {
      case "m":
      case "M":
        document.body.classList.toggle("dark");
        break;
      case "d":
      case "D":
        showMainSection("dashboard");
        highlightNavLink("dashboard"); // Highlighting the navlink is still not working...!!
        break;
      case "a":
      case "A":
        showMainSection("about");
        highlightNavLink("about");
        break;
      case "r":
      case "R":
        showMainSection("reference");
        highlightNavLink("reference");
        break;
      case "c":
      case "C":
        showMainSection("contact");
        highlightNavLink("contact");
        break;
    }

    // Arrow keys and space only work when dashboard section is active
    if (dashboard.classList.contains("active")) {
      switch (event.key) {
        case " ": // Space
        case "ArrowRight":
          navigateDashSections("next");
          break;
        case "ArrowLeft":
          navigateDashSections("prev");
          break;
        case "x":
        case "X":
          if (!popupWindow.classList.contains("active")) {
            popupWindow.classList.remove("closing");
            popupWindow.classList.add("active", "opening");
          } else {
            popupWindow.classList.add("closing");
          }
          break;
        case "Escape":
          event.preventDefault();
          popupWindow.classList.add("closing");
      }
    }
  }
});

// Function to navigate through dash sections using arrow keys
function navigateDashSections(direction) {
  const sections = document.querySelectorAll(
    ".progress-sections .dash-content-section"
  );
  const buttons = {
    next: [
      "#complete-cc",
      "#complete-ac",
      "#complete-history",
      "#complete-pe",
      "#complete-labs",
      "#complete-imaging",
      "#complete-diagnosis",
      "#finish",
    ],
    prev: [
      "#back-to-cc",
      "#back-to-ac",
      "#back-to-history",
      "#back-to-pe",
      "#back-to-labs",
      "#back-to-imaging",
      "#back-to-diagnosis",
      "#back-to-treatment",
    ],
  };

  if (direction === "next" && currentStep < sections.length - 1) {
    const nextButton = document.querySelector(buttons.next[currentStep]);
    if (nextButton) {
      nextButton.click();
    }
  } else if (direction === "prev" && currentStep > 0) {
    const prevButton = document.querySelector(buttons.prev[currentStep - 1]);
    if (prevButton) {
      prevButton.click();
    }
  }
}

// Fetch data from backend & update and populate the dropdown menu
document.addEventListener("DOMContentLoaded", async () => {
  const dropdown = document.getElementById("itemsDropdown");
  const refreshButton = document.getElementById("refreshButton");

  // Function to fetch items and update the dropdown
  async function fetchAndPopulateDropdown() {
    try {
      const response = await fetch("http://localhost:8000/conditions");

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();

      // Clear the existing options
      dropdown.innerHTML = '<option value="">Select a condition</option>';

      if (Array.isArray(data)) {
        data.forEach((condition) => {
          const option = document.createElement("option");
          option.value = condition;
          option.text = condition;
          dropdown.appendChild(option);
        });
      } else {
        console.warn("No data found or data is not in expected format:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Call the function once on DOM content load
  await fetchAndPopulateDropdown();

  // Add event listener to the refresh button
  refreshButton.addEventListener("click", async () => {
    await fetchAndPopulateDropdown();
  });

  // Add change event listener to the dropdown
  dropdown.addEventListener("change", async (event) => {
    const selectedItem = event.target.value;
    await fetchAndDisplayItemDetails(selectedItem);
    dropdown.blur(); // Remove the active state from the dropdown
  });

  dropdown.addEventListener("focusout", () => {
    dropdown.blur(); // Remove the active state from the dropdown
  });
});

async function fetchAndDisplayItemDetails(name) {
  try {
    const response = await fetch(`http://localhost:8000/${name}`);

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    renderItemDetails(data);
  } catch (error) {
    console.error("Error fetching item details:", error);
  }
}

function renderItemDetails(data) {
  const referenceContainer = document.querySelector(".reference-container");
  referenceContainer.innerHTML = ""; // Clear previous content

  function createSectionElement(title, content, className) {
    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("section", className);

    const sectionTitle = document.createElement("h3");
    sectionTitle.textContent = title;
    sectionTitle.classList.add("section-title");
    sectionDiv.appendChild(sectionTitle);

    const sectionContent = document.createElement("div");
    if (
      ["name-section", "title-section", "abbreviation-section"].includes(
        className
      )
    ) {
      sectionContent.classList.add("title-content");
    } else {
      sectionContent.classList.add("section-content");
    }

    if (content)
      if (
        [
          "name-section",
          "title-section",
          "abbreviation-section",
          "risk-factors-section",
          "description-section",
        ].includes(className)
      ) {
        if (typeof content === "object") {
          sectionContent.textContent = JSON.stringify(content, null, 2);
        } else {
          sectionContent.textContent = content;
        }
      } else {
        let formattedContent;
        if (typeof content === "object") {
          formattedContent = JSON.stringify(content, null, 2);
        } else {
          formattedContent = content;
        }
        sectionContent.innerHTML = `<pre><code class="language-json">${formattedContent}</code></pre>`;
        Prism.highlightElement(sectionContent.querySelector("code"));
      }
    else {
      sectionContent.textContent = "No data for this section";
      sectionContent.classList.remove("section-content");
      sectionContent.classList.add("no-data");
    }
    sectionDiv.appendChild(sectionContent);

    return sectionDiv;
  }

  function createRiskFactorsSection(title, riskFactors) {
    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("section", "risk-factors-section");

    const sectionTitle = document.createElement("h3");
    sectionTitle.textContent = title;
    sectionTitle.classList.add("section-title");
    sectionDiv.appendChild(sectionTitle);

    const sectionContent = document.createElement("div");
    sectionContent.classList.add("no-data");

    if (!riskFactors || riskFactors.length === 0) {
      sectionContent.textContent = "No data for this section";
    } else {
      sectionContent.classList.remove("no-data");
      sectionContent.classList.add("section-content");
      // Create columns for odd and even items
      const oddColumn = document.createElement("div");
      oddColumn.classList.add("column");
      const evenColumn = document.createElement("div");
      evenColumn.classList.add("column");

      // Populate columns with items
      riskFactors.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.textContent = item; // Add dot before each item
        itemDiv.classList.add("section-item");
        if (index % 2 === 0) {
          // Even-numbered items go to the even column
          evenColumn.appendChild(itemDiv);
        } else {
          // Odd-numbered items go to the odd column
          oddColumn.appendChild(itemDiv);
        }
      });

      // Append columns to section content
      sectionContent.appendChild(evenColumn);
      sectionContent.appendChild(oddColumn);
    }

    sectionDiv.appendChild(sectionContent);
    return sectionDiv;
  }

  const nameTitleAbbrContainer = document.createElement("div");
  nameTitleAbbrContainer.classList.add("name-title-abbr-container");

  nameTitleAbbrContainer.appendChild(
    createSectionElement("Name", data.name, "name-section")
  );
  nameTitleAbbrContainer.appendChild(
    createSectionElement("Title", data.title, "title-section")
  );
  nameTitleAbbrContainer.appendChild(
    createSectionElement(
      "Abbreviation",
      data.abbreviation,
      "abbreviation-section"
    )
  );

  referenceContainer.appendChild(nameTitleAbbrContainer);

  const descAndRiskContainer = document.createElement("div");
  descAndRiskContainer.classList.add("description-risk-container");

  descAndRiskContainer.appendChild(
    createRiskFactorsSection("Risk Factors", data["risk-factors"])
  );

  descAndRiskContainer.appendChild(
    createSectionElement("Description", data.description, "description-section")
  );

  referenceContainer.appendChild(descAndRiskContainer);

  const ssPeContainer = document.createElement("div");
  ssPeContainer.classList.add("ss-pe-container");

  ssPeContainer.appendChild(
    createSectionElement("Signs and Symptoms", data.ss, "ss-section")
  );
  ssPeContainer.appendChild(
    createSectionElement("Physical Examination", data.pe, "pe-section")
  );

  referenceContainer.appendChild(ssPeContainer);

  const labsImagingContainer = document.createElement("div");
  labsImagingContainer.classList.add("labs-imaging-container");

  labsImagingContainer.appendChild(
    createSectionElement("Laboratory Results", data.labs, "labs-section")
  );
  labsImagingContainer.appendChild(
    createSectionElement("Imaging", data.imaging, "imaging-section")
  );

  referenceContainer.appendChild(labsImagingContainer);
}

// Open / close popup window
var popupWindow = document.getElementById("popupWindow");
var btn = document.getElementById("complete-cc");
var span = document.getElementsByClassName("close-button")[0];

// Add single event listener for animation end
popupWindow.addEventListener("animationend", function () {
  if (popupWindow.classList.contains("opening")) {
    popupWindow.classList.remove("opening");
  } else if (popupWindow.classList.contains("closing")) {
    popupWindow.classList.remove("active", "closing");
  }
});

span.onclick = function () {
  popupWindow.classList.add("closing");
};

// //Instead of button click, we need to change it to valuechnage event in a dropdown menu.
// btn.onclick = function () {
//   popupWindow.classList.remove("closing");
//   popupWindow.classList.add("active", "opening");
// };

// // When the user clicks anywhere outside of the popup window, close it
// window.onclick = function (event) {
//   if (event.target == popupWindow) {
//     popupWindow.classList.remove("active");
//   }
// };

// Experimental code here
