(function () {
  function setCopyState(button) {
    button.classList.remove("is-copied", "is-failed");
    button.setAttribute("aria-label", "Copy code");
    button.innerHTML = '<i class="fa fa-copy" aria-hidden="true"></i>';
  }

  function setOkState(button) {
    button.classList.remove("is-failed");
    button.classList.add("is-copied");
    button.setAttribute("aria-label", "Copied");
    button.textContent = "OK";
    window.setTimeout(function () {
      setCopyState(button);
    }, 1700);
  }

  function setFailedState(button) {
    button.classList.remove("is-copied");
    button.classList.add("is-failed");
    button.setAttribute("aria-label", "Copy failed");
    button.textContent = "!";
    window.setTimeout(function () {
      setCopyState(button);
    }, 1700);
  }

  document.querySelectorAll("pre code").forEach(function (codeBlock) {
    var pre = codeBlock.parentElement;
    if (!pre || pre.querySelector(".copy-btn")) return;

    var button = document.createElement("button");
    button.className = "copy-btn";
    button.type = "button";
    setCopyState(button);

    button.addEventListener("click", function () {
      var code = codeBlock.innerText;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () {
          setOkState(button);
        }).catch(function () {
          setFailedState(button);
        });
        return;
      }

      try {
        var textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setOkState(button);
      } catch (error) {
        setFailedState(button);
      }
    });

    pre.appendChild(button);
  });
})();
