let initFormWidth

$(() => {

  $('.form__input')
    .keyup(formInput)
    .each(formInput)

  $('[data-form-button]')
    .on('click', login)

})

function formInput(input) {
  let width = $(this).val().length * 9.5
  initFormWidth = initFormWidth || width
  $(this).css('width', initFormWidth > width ? initFormWidth : width)
  if (input.which === 13) {
    submitForm($(this).attr('data-form-input'))
  }
}

function login() {
  const dataValue = $(this).attr('data-form-button')
  submitForm(dataValue)
}

function submitForm(formName) {
  $('#'+ formName).submit()
}
