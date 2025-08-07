const statementsConfig = {
  "Социальная стипендия": {
    template: "social-template.docx",
    fields: [
      { name: "course", label: "Курс", type: "number", placeholder: "1" },
      { name: "group", label: "Группа", type: "text", placeholder: "АБ12-34В"  },
      { name: "fullName", label: "ФИО", type: "text", placeholder: "Иванов Иван Иванович"  },
      { name: "phoneNumber", label: "Номер телефона", type: "tel", placeholder: "81234567890"  },
      { name: "email", label: "Email", type: "email", placeholder: "example@mail.ru"  },
      { name: "reason", label: "Причина назначения стипендии", type: "text", placeholder: "Прошу назначить социальную стипендию..." },
      { name: "documents", label: "Документы", type: "text", placeholder: "Паспорт" },
      { name: "passSeries", label: "Серия паспорта", type: "number", placeholder: "1234" },
      { name: "passNumber", label: "Номер паспорта", type: "number", placeholder: "567890" },
      { name: "passDate", label: "Дата выдачи паспорта", type: "date" },
      { name: "passIssued", label: "Кем выдан", type: "text", placeholder: "Введите место выдачи"  },
      { name: "dateOfBirth", label: "Дата рождения", type: "date" },
      { name: "inn", label: "ИНН", type: "number", placeholder: "Введите ИНН" },
      { name: "snils", label: "СНИЛС", type: "text", placeholder: "Введите СНИЛС" },
      { name: "homeAddress", label: "Домашний адрес (Фактическое проживание)", type: "text", placeholder: "Введите домашний адрес" },
      { name: "dateFilling", label: "Дата заполнения", type: "date" },
    ],
  },
  "Материальная помощь (Скамим СФУ)": {
    template: "material-template.docx",
    fields: [
      { name: "course", label: "Курс", type: "number", placeholder: "1" },
      { name: "group", label: "Группа", type: "text", placeholder: "АБ12-34В"  },
      { name: "fullName", label: "ФИО", type: "text", placeholder: "Иванов Иван Иванович"  },
      { name: "passSeries", label: "Серия паспорта", type: "number", placeholder: "1234" },
      { name: "passNumber", label: "Номер паспорта", type: "number", placeholder: "567890" },
      { name: "passDate", label: "Дата выдачи паспорта", type: "date" },
      { name: "passIssued", label: "Кем выдан", type: "text", placeholder: "Введите место выдачи"  },
      { name: "dateOfBirth", label: "Дата рождения", type: "date" },
      { name: "inn", label: "ИНН", type: "number", placeholder: "Введите ИНН" },
      { name: "snils", label: "СНИЛС", type: "text", placeholder: "Введите СНИЛС" },
      { name: "homeAddress", label: "Домашний адрес (Фактическое проживание)", type: "text", placeholder: "Введите домашний адрес" },
      { name: "email", label: "Email", type: "email", placeholder: "example@mail.ru"  },
      { name: "phoneNumber", label: "Номер телефона", type: "tel", placeholder: "81234567890"  },
      { name: "reason", label: "Причина оказания помощи", type: "text", placeholder: "Основание оказания материальной поддержки" },
      { name: "dateFilling", label: "Дата заполнения", type: "date" },
    ],
  },
}

const formElement = document.querySelector("#form")
const statementsItemElements = document.querySelectorAll(".statements__item")
const statementsButtonElements = document.querySelectorAll(".statements__button")
let currentTemplate = ''

statementsButtonElements.forEach((statementsButtonElement) => {
  statementsButtonElement.addEventListener("click", () => {
    const statementsItemElement = statementsButtonElement.closest(".statements__item")
    const statementsTitleElementText = statementsItemElement.querySelector(".statements__title").textContent.trim()

    const config = statementsConfig[statementsTitleElementText];
    if (!config) return alert("Форма не настроена!");
    
    currentTemplate = config.template;

    statementsItemElements.forEach((statementsItemElement) => statementsItemElement.style.display = "none")

    formElement.classList.remove("visually-hidden")
    formElement.innerHTML = ""

    const formTitle = document.createElement("h2")
    formTitle.textContent = `${statementsTitleElementText}`
    formElement.appendChild(formTitle)

    let fieldsHTML = ""

    config.fields.forEach((field) => {
      const label = document.createElement("label");
      const placeholder = field.placeholder ? ` placeholder="${field.placeholder}"` : "";
      label.innerHTML = `${field.label}: <input type="${field.type}" name="${field.name}"${placeholder} required />`;
      formElement.appendChild(label);
    });

    const submitButton = document.createElement("button")
    submitButton.type = "submit"
    submitButton.textContent = "Сгенерировать заявление"
    formElement.appendChild(submitButton)
    
    formElement.insertAdjacentHTML("beforeend", fieldsHTML)
    
    const formButtonBack = document.createElement("button")
    formButtonBack.textContent = "Вернуться назад"
    formButtonBack.style.backgroundColor = "#e7e7e7"
    formButtonBack.style.color = "#000000"
    formButtonBack.addEventListener("click", (e) => {
      e.preventDefault()
      
      fieldsHTML = ""
      statementsItemElements.forEach((statementsItemElement) => statementsItemElement.style.display = "flex")
      formElement.classList.add("visually-hidden")
    })
    
    formElement.appendChild((formButtonBack))
  })
})

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value
  }

  if (data.passDate) {
    const datePassObj = new Date(data.passDate);
    data.passDay = String(datePassObj.getDate()).padStart(2, '0');
    data.passMonth = String(datePassObj.getMonth() + 1).padStart(2, '0'); // +1 потому что январь = 0
    data.passYear = String(datePassObj.getFullYear());
  }

  if (data.dateFilling) {
    const dateFillingObj = new Date(data.dateFilling);
    data.fillingDay = String(dateFillingObj.getDate()).padStart(2, '0');
    data.fillingMonth = String(dateFillingObj.getMonth() + 1).padStart(2, '0'); // +1 потому что январь = 0
  }

  try {
    const response = await fetch(currentTemplate);
    const arrayBuffer = await response.arrayBuffer();

    const zip = new PizZip(arrayBuffer);
    const doc = new window.docxtemplater(zip, {
      paragraphLoop: true, linebreaks: true,
    });

    doc.setData(data);

    doc.render();

    const out = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(out);
    link.download = "zayavlenie.docx";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Ошибка при генерации:", error);
    alert("Ошибка при генерации документа. Проверь шаблон и данные.");
  }
});
