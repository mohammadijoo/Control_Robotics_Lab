(function () {
  function setCopyState(button) {
    button.classList.remove("is-copied", "is-failed");
    button.setAttribute("aria-label", "Copy code");
    button.setAttribute("title", "Copy code");
  }

  function setOkState(button) {
    button.classList.remove("is-failed");
    button.classList.add("is-copied");
    button.setAttribute("aria-label", "Copied");
    button.setAttribute("title", "Copied");

    window.setTimeout(function () {
      setCopyState(button);
    }, 1700);
  }

  function setFailedState(button) {
    button.classList.remove("is-copied");
    button.classList.add("is-failed");
    button.setAttribute("aria-label", "Copy failed");
    button.setAttribute("title", "Copy failed");

    window.setTimeout(function () {
      setCopyState(button);
    }, 1700);
  }

  function createCopyButton(pre, codeBlock) {
    if (pre.querySelector(".copy-btn")) {
      return;
    }

    var copyButton = document.createElement("button");

    copyButton.className = "copy-btn";
    copyButton.type = "button";

    setCopyState(copyButton);

    copyButton.addEventListener("click", function () {
      /*
       * Use textContent instead of innerText.
       * This allows copying even while the code block is collapsed.
       */
      var code = codeBlock.textContent;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(code)
          .then(function () {
            setOkState(copyButton);
          })
          .catch(function () {
            setFailedState(copyButton);
          });

        return;
      }

      /*
       * Fallback for browsers that do not support
       * navigator.clipboard.writeText().
       */
      try {
        var textArea = document.createElement("textarea");

        textArea.value = code;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";

        document.body.appendChild(textArea);
        textArea.select();

        var successful = document.execCommand("copy");

        document.body.removeChild(textArea);

        if (successful) {
          setOkState(copyButton);
        } else {
          setFailedState(copyButton);
        }
      } catch (error) {
        setFailedState(copyButton);
      }
    });

    pre.appendChild(copyButton);
  }

  function createToggleButton(pre) {
    if (pre.querySelector(".code-toggle-btn")) {
      return;
    }

    var toggleButton = document.createElement("button");

    toggleButton.className = "code-toggle-btn";
    toggleButton.type = "button";

    /*
     * The code block is open by default, so the button initially
     * displays the minus icon.
     */
    toggleButton.setAttribute("aria-expanded", "true");
    toggleButton.setAttribute("aria-label", "Collapse code");
    toggleButton.setAttribute("title", "Collapse code");

    toggleButton.addEventListener("click", function () {
      var isCollapsed = pre.classList.toggle("is-code-collapsed");

      toggleButton.classList.toggle("is-collapsed", isCollapsed);
      toggleButton.setAttribute(
        "aria-expanded",
        String(!isCollapsed)
      );

      if (isCollapsed) {
        toggleButton.setAttribute("aria-label", "Expand code");
        toggleButton.setAttribute("title", "Expand code");
      } else {
        toggleButton.setAttribute("aria-label", "Collapse code");
        toggleButton.setAttribute("title", "Collapse code");
      }
    });

    pre.appendChild(toggleButton);
  }

  document.querySelectorAll("pre code").forEach(function (codeBlock) {
    var pre = codeBlock.parentElement;

    if (!pre) {
      return;
    }

    createCopyButton(pre, codeBlock);
    createToggleButton(pre);
  });
})();