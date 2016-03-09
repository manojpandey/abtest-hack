(function ($) {

  $(document).ready(function() {

    /* A/B Test Configuration */
    $('#btn-abtest').sparkab({
        'slot': 1,
        'scope': 2,
        'name': 'button-ABtest',
        'default-value': 'green',
        'alternatives': [{
            'value': 'red',
            'alternative': function($this) {
                $this.removeClass('btn-success').addClass('btn-danger');
            }
        }]
    });

    $('#lbl-greeting').sparkab({
        'slot': 1,
        'scope': 2,
        'name': 'label-greeting',
        'default-value': 'welcome',
        'alternatives': [{
            'value': 'awesome',
            'alternative': 'You\'re Awesome'
        }]
    });
  });

    window.setTimeout(function() {
        mixpanel.track("Session", {
            "lbl-greeting" : getCookie("label-greeting"),
            "btn-abtest" : getCookie("button-ABtest")
        });
    }, 1000);

    $('#btn-abtest').click(function(event) {
        mixpanel.track("btn-abtest" + getCookie("button-ABtest"));
        console.log("[@mixpanel]: " + "btn-abtest" + getCookie("button-ABtest"));
    });

})(window.jQuery);

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}