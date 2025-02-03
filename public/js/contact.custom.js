// To make Pace works on Ajax calls
$(document).ajaxStart(function () {
  Pace.restart()
})

$('#sms-form').submit(() => {
  var message = $('#message').val();
  if (message) {
    $.ajax({
      type: 'POST',
      data: {
        message: message
      },
      success: function (result) {
        if (result.status) {
          $('#sms').html('<div class="box-body">' +
            '<h3>پیامک با موفقیت ارسال شد</h3>' +
            '<div class="box-footer">' +
            '<a href="/web/contact/sms" class="btn btn-primary pull-left">بازگشت</a>' +
            '</div>' +
            '</div>')
        }
      },
      error: function (xhr, status, error) {
        $('#sms').html(`
            <div class="box-body">
                <h3>ارسال پیامک با خطا مواجه شده است</h3>
                <h4>${xhr.responseJSON.error}</h4>
                <div class="box-footer">
                    <a href="/web/contact/sms" class="btn btn-primary pull-left">بازگشت</a>
                </div>
            </div>`)
      },
    })
  }
  return false;
});
