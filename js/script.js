'use strict';
(function ($) {
  $(function () {

    $("select").styler();

    var idSelect = $('#select-credit-card'),
      idCardImg = $('#change-credit-card'),
      idCardIcons = $('.credit-cards-icon'),
      cardClass = 'mc visa ae ec jcb';

    idSelect.on('change', function () {
      changeSelect(idSelect, idCardImg);
    });

    idCardIcons.on('click', 'li', function () {
      changeCardIcon($(this), idCardImg, idSelect);
    });

    changeSelect(idSelect, idCardImg);

    function changeCardIcon(idCardIcons, idCardImg, idSelect) {
      var thisIcon = idCardIcons.attr('class');
      if (idCardImg.attr('class') !== thisIcon) {
        idCardImg.removeClass(cardClass).addClass(thisIcon);
        idSelect.find('option').each(function () {
          if ($(this).attr('value') === thisIcon) {
            idSelect.find('option').removeAttr('selected');
            $(this).attr('selected', 'selected').trigger('refresh');
          }
        });
      }
    }

    function changeSelect(idSelect, idCardImg) {
      var selectOptionValue = idSelect.find(':selected').attr('value');
      if (idCardImg.attr('class') !== selectOptionValue) {
        idCardImg.removeClass(cardClass).addClass(selectOptionValue);
      }
    }

  });
}(jQuery));