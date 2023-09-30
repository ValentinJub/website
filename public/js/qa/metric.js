$(function() {
    $('#convertForm').submit(function(event) {
      event.preventDefault();
      $.ajax({
        url: '/projects/qa/metric-converter/api/convert',
        type: 'get',
        data: $('#convertForm').serialize(),
        success: function(data) {
          $('#result').text(data.string || data);
          $('#jsonResult').text(JSON.stringify(data));
        }
      });
    });
});