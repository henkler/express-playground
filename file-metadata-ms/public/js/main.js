function fileUpload(file) {
  var formData = new FormData();
  formData.append('metadata', file);

  $.ajax({
    url: '/api/filemetadata/',
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    cache: false,
    error: function(jqXHR, textStatus, errorThrown) {
      $("#fileSize").text("Error:" + textStatus);
    },
    success: function(data, textStatus, jqXHR) {
      $("#fileSize").text(data.size + ' bytes');
    }
  });
}

$(document).ready(function() {
  var file = '';
  $("#file").on("change", function(event) {
    file = event.target.files[0];
  });

  $("#uploadForm").on("submit", function(event) {
    event.preventDefault();
    event.stopPropagation();

    if (file != '') {
      fileUpload(file);
    }
  })
});
