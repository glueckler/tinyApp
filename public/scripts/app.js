$(() => {

  function resizeInput() {
    let width
    width = Math.floor($(this).val().length * 7.9)
    $(this).css('width', width)
  }

  $('.login-form__input')
    .keyup(resizeInput)
    .each(resizeInput)

  $('[data-login="submit"]')
    .on('click', login)

})

function login() {
  $('.login-form > form').submit()
}
