const FormExtension = {
  name: 'Forms',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'Custom_Form' || trace.payload.name === 'Custom_Form',
  render: ({ trace, element }) => {
    const formContainer = document.createElement('form');

    formContainer.innerHTML = `
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
      form {
      font-family: 'Roboto', sans-serif;
      max-width: 85%;
      margin: auto;
      padding: 8px;
      background-color: transparent;
      border-radius: 8px;
    }

    label {
      font-size: 0.7em; /* Justert til lik størrelse som chatten */
      color: #333;
      display: block;
      margin: 6px 0 3px;
      font-weight: 500;
    }

    input[type="text"], input[type="email"], textarea {
      width: 100%;
      border: 1px solid #003677;
      background-color: #fff;
      color: #333;
      margin: 6px 0;
      padding: 6px;
      outline: none;
      font-size: 0.7em; /* Justert til lik størrelse som chatten */
      font-family: Arial, sans-serif;
      border-radius: 6px;
      box-sizing: border-box;
    }

    textarea {
      height: 70px;
    }

    .invalid {
      border-color: red;
    }

    .submit {
      background-color: #003677;
      border: none;
      color: white;
      padding: 8px;
      border-radius: 6px;
      margin-top: 12px;
      width: 100%;
      cursor: pointer;
      font-size: 0.7em; /* Justert til lik størrelse som chatten */
      font-weight: 500;
    }
      </style>

      <label for="email">Mail</label>
      <input type="email" class="email" name="email" required
             pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
             title="Ugyldig e-post"><br>

      <label for="topic">Emne</label>
      <input type="text" class="topic" name="topic" required><br>

      <label for="userQuestion">Melding</label>
      <textarea class="userQuestion" name="userQuestion" required></textarea><br>

      <input type="submit" class="submit" value="Send">
    `;

    // Prefill the form fields with the variables from trace.payload
    const emailInput = formContainer.querySelector('.email');
    const topicInput = formContainer.querySelector('.topic');
    const userQuestionInput = formContainer.querySelector('.userQuestion');

    emailInput.value = trace.payload.email || '';
    topicInput.value = trace.payload.topic || '';
    userQuestionInput.value = trace.payload.userQuestion || '';

    formContainer.addEventListener('input', function () {
      // Remove 'invalid' class when input becomes valid
      if (emailInput.checkValidity()) emailInput.classList.remove('invalid');
      if (topicInput.checkValidity()) topicInput.classList.remove('invalid');
      if (userQuestionInput.checkValidity()) userQuestionInput.classList.remove('invalid');
    });

    formContainer.addEventListener('submit', function (event) {
      event.preventDefault();

      if (
        !emailInput.checkValidity() ||
        !topicInput.checkValidity() ||
        !userQuestionInput.checkValidity()
      ) {
        if (!emailInput.checkValidity()) emailInput.classList.add('invalid');
        if (!topicInput.checkValidity()) topicInput.classList.add('invalid');
        if (!userQuestionInput.checkValidity()) userQuestionInput.classList.add('invalid');
        return;
      }

      formContainer.querySelector('.submit').remove();

      window.voiceflow.chat.interact({
        type: 'complete',
        payload: {
          email: emailInput.value,
          topic: topicInput.value,
          userQuestion: userQuestionInput.value,
        },
      });
    });

    element.appendChild(formContainer);
  },
};


let widgetStyleSheet = "https://swnevin.github.io/VIF/style.css"
let proactiveMessage = "Hei, jeg hjelper deg gjerne!👋";

    (function(d, t) {
      var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
      v.onload = function() {
        window.voiceflow.chat.load({
          verify: { projectID: '6792a785b51b9ae7ae4c81d0' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
          allowDangerousHTML: true,
          assistant: {
            extensions: [FormExtension],
            stylesheet: widgetStyleSheet
          }
        }).then(() => {
          console.log('Voiceflow widget loaded successfully');
          window.voiceflow.chat.proactive.clear();
          window.voiceflow.chat.proactive.push(
            { type: 'text', payload: { message: proactiveMessage } }
          );
        }).catch((err) => console.error('Widget load failed:', err));
      };
      v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
      v.type = "text/javascript";
      s.parentNode.insertBefore(v, s);
    })(document, 'script');
