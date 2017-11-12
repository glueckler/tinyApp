$(() => {

  function resizeInput() {
    let width
    width = Math.floor($(this).val().length * 7.9)
    $(this).css('width', width)
  }

  $('.login-form__input')
      // event handler
      .keyup(resizeInput)
      // resize on page load
      .each(resizeInput)

})