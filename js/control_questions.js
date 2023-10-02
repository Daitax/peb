let isLoading = true

function printQuestion(question) {
    if (question.type == "radio") {
        return printRadioQuestion(question)
    } else if (question.type == "checkbox") {
        return printCheckboxQuestion(question)
    }
}

function printRadioQuestion(question) {
    let html = ''
    html += '<form class="control-questions_item" test-form-elem="form">'
    html +=     '<div class="test_form_question_wrapper">'
    html +=         `<div class="test_form_question_number">${question.number}</div>`
    html +=         `<div class="test_form_question">${question.question}</div>`
    html +=     '</div>'
                for(let answer in question.answers){
                    html += '<label class="test_form_label test_form_radio_wrapper">'
                    html +=     `<input class="test_form_radio" type="radio" name="answer${question.number}" value="${parseInt(answer) + 1}">`
                    html +=     '<div class="test_form_custom_radio"></div>'
                    html +=     `<div class="test_form_answer">${question.answers[answer]}</div>`
                    html += '</label>'
                }
    html +=     '<div class="control-questions_item_prompt_wrapper" test-form-elem="prompt-wrapper">'
    html +=         '<a class="control-questions_item_prompt_open" test-form-elem="prompt-open">подсказка</a>'
    html +=         '<div class="control-questions_item_prompt" test-form-elem="prompt">'
    html +=             '<span>Подсказка: </span>'
    html +=             question.prompt
    html +=         '</div>'
    html +=     '</div>'
    html +=     '<div class="control-questions_item_buttons_wrapper">'
    html +=         '<button type="button" class="white-blue_button control-questions_item_button">Ответить</button>'
    html +=         '<div class="control-questions_item_result"></div>'
    html +=     '</div>'
    html += '</form>'

    return html
}

function printCheckboxQuestion(question) {
    let html = ''
    html += '<form class="control-questions_item" test-form-elem="form">'
    html +=     '<div class="test_form_question_wrapper">'
    html +=         `<div class="test_form_question_number">${question.number}</div>`
    html +=         `<div class="test_form_question">${question.question}</div>`
    html +=     '</div>'
                for(let answer in question.answers){
                    html += '<label class="test_form_label test_form_checkbox_wrapper">'
                    html +=     `<input class="test_form_checkbox" type="checkbox" name="answer${question.number}" value="${parseInt(answer) + 1}">`
                    html +=     '<div class="test_form_custom_checkbox"></div>'
                    html +=     `<div class="test_form_answer">${question.answers[answer]}</div>`
                    html += '</label>'
                }
    html +=     '<div class="control-questions_item_prompt_wrapper" test-form-elem="prompt-wrapper">'
    html +=         '<a class="control-questions_item_prompt_open" test-form-elem="prompt-open">подсказка</a>'
    html +=         '<div class="control-questions_item_prompt" test-form-elem="prompt">'
    html +=             '<span>Подсказка: </span>'
    html +=             question.prompt
    html +=         '</div>'
    html +=     '</div>'
    html +=     '<div class="control-questions_item_buttons_wrapper">'
    html +=          '<button type="button" class="white-blue_button control-questions_item_button">Ответить</button>'
    html +=          '<div class="control-questions_item_result"></div>'
    html +=     '</div>'
    html += '</form>'

    return html
}

function loadControlQuestions(wrapper, trigger) {
    if (isLoading) {
        trigger.classList.add('loading')
        let inner = wrapper.querySelector('[control-questions-elem="inner"]')
        let errorElement = wrapper.querySelector('[control-questions-elem="errors"]')
        let currentPage = parseInt(wrapper.getAttribute('page'))
        let currentPerPage = parseInt(wrapper.getAttribute('per-page'))
        isLoading = false
        errorElement.innerHTML = ''

        let body = {
            'page': currentPage,
            'per_page': currentPerPage
        }

        fetch('http://tst/request.php', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then((data) => {
                if(data.status == 'success') {
                    let htmlQuestion = ''
                    for (let question in data.questions) {
                        htmlQuestion += printQuestion(data.questions[question])
                    }

                    trigger.classList.remove('loading')
                    inner.insertAdjacentHTML("beforeend", htmlQuestion)
                    wrapper.setAttribute('page', data.page)
                    wrapper.setAttribute('per-page', data.per_page)

                    if (data.total > data.page * data.per_page) {
                        isLoading = true
                    }
                }

                if(data.status == 'error') {
                    trigger.classList.remove('loading')
                    errorElement.innerHTML = data.message
                }
            });
    }
}

let controlQuestionsWrapper = document.querySelector('[control-questions-elem="wrapper"]')
if (controlQuestionsWrapper) {
    window.addEventListener('scroll', function () {
        let controlQuestionsAjaxTrigger = controlQuestionsWrapper.querySelector('[control-questions-elem="ajax-trigger"]')

        if (controlQuestionsAjaxTrigger && getComputedStyle(controlQuestionsAjaxTrigger).display == 'block') {
            let screenHeight = window.innerHeight
            let scrolled = window.scrollY
            let bottomScroll = screenHeight + scrolled

            let controlQuestionsAjaxTriggerBox = controlQuestionsAjaxTrigger.getBoundingClientRect()
            let controlQuestionsAjaxTriggerPosition = controlQuestionsAjaxTriggerBox.top + window.pageYOffset

            let controlQuestionsInner = controlQuestionsWrapper.querySelector('[control-questions-elem="inner"]')

            if (bottomScroll > controlQuestionsAjaxTriggerPosition) {
                loadControlQuestions(controlQuestionsWrapper, controlQuestionsAjaxTrigger)
            }
        }
    });

    controlQuestionsWrapper.addEventListener('click', function(event) {
        if (event.target.getAttribute('test-form-elem') == 'prompt-open') {
            let prompt = event.target.closest('[test-form-elem="prompt-wrapper"]')
            prompt.classList.add('open')
        }
    })
}