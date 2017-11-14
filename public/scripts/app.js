$(() => {

  function formInput(input) {
    let width
    width = Math.floor($(this).val().length * 8.4)
    $(this).css('width', width)
    if (input.which === 13) {
      submitForm($(this).attr('data-form-input'))
    }

  }

  $('.form__input')
    .keyup(formInput)
    .each(formInput)

  $('[data-form-button]')
    .on('click', login)

})

function login() {
  const dataValue = $(this).attr('data-form-button')
  submitForm(dataValue)
}

function submitForm(formName) {
  $('#'+ formName).submit()
}
