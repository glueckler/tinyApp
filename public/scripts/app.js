let initFormWidth

$(() => {

  $('.form__input')
    .keyup(formInput)
    .each(formInput)

  $('[data-form-button]')
    .on('click', login)

  $sHeader = $('.scaled-header')
  const sHeaderVal = $sHeader.text()
  $sHeader.css('font-size', scaledFontSize(sHeaderVal))

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

function scaledFontSize(string) {
  const l = string.length
  if (l < 30) {
    return '1.4em'
  } else if (l > 100) {
    return '.9em'
  } else {
    return ((0.9) + (70 - (l - 30)) * (0.5 / 70) ).toString() + 'em'
  }
}
