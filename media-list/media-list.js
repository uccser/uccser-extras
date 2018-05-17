const GITHUB_API_BASE = "https://api.github.com/";
const MEDIA_TYPES = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".ico",
  ".svg",
]
const EMBED_TYPES = [
]

$(document).ready(function() {
  $("#get-files").click(function(){
    $("#errors").empty();
    $(".invisible").removeClass("invisible").addClass("visible");
    get_all_files();
  });
});

function get_all_files(){
  get_github_files("csunplugged/static/img", "cs-unplugged", "csu");
  get_github_files("images", "cs-field-guide", "csfg");
  get_github_files("interactives/fsa-washing-machine/img", "cs-field-guide", "csfg");
  get_github_files("interactives/jpeg-compression/img", "cs-field-guide", "csfg");
  get_github_files("interactives/packet-attack/assets", "cs-field-guide", "csfg");
  get_github_files("interactives/trainsylvania/img", "cs-field-guide", "csfg");
  get_github_files("interactives/sorting-algorithms/project-files/sprites", "cs-field-guide", "csfg");
}

function get_github_files(path, repo, container) {
  $.ajax({
    type: "GET",
    url: GITHUB_API_BASE + "repos/uccser/" + repo + "/contents/" + path,
    async: true,
    cache: true,
    dataType: "json",
    headers: {
      "Authorization": "token " + $( "#accessTokenInput" ).val()
    },
    accepts: {
      json: "application/vnd.github.v3+json",
    },
    success: function(data) {
      show_github_files(data, repo, container);
    },
    error: show_error,
  });
}

function show_github_files(data, repo, container) {
  data.forEach(function(item) {
    if (item.type == "file" && endsWithAny(MEDIA_TYPES, item.name)) {
      var element = $( "<div class='col-12 col-sm-6 col-md-4 col-lg-3 text-center border'></div>" );
      element.append( "<a href='" + item.download_url + "'><p>" + item.name + "</p></a>");
      if (endsWithAny(MEDIA_TYPES, item.name)) {
        if (item.name.endsWith(".svg")) {
          item.download_url = item.download_url.replace(String("raw.githubusercontent"), "cdn.rawgit");
        }
        element.prepend($( "<img src='" + item.download_url +"' class='img-fluid'>" ));
      } else if (endsWithAny(EMBED_TYPES, item.name)) {

      }
      $( "#" + container + "-files" ).append(element);
    } else if (item.type == "dir") {
      get_github_files(item.path, repo, container);
    }
  });
}

function show_error(jqXHR, text_status, error_thrown) {
  console.log(jqXHR, text_status, error_thrown)
  $("#errors").append($("<div>" + jqXHR.responseText + "</div>"));
}

// From https://stackoverflow.com/a/45069552
function endsWithAny(suffixes, string) {
    return suffixes.some(function (suffix) {
        return string.endsWith(suffix);
    });
}
