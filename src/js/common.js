(function ($) {

    'use strict';

    $(function () {

        $('select').styler();

        var idSelect = $('#select-credit-card'),
            idCardImg = $('.change-credit-card'),
            idCardIcons = $('.credit-cards-icon'),
            cardClass = 'mc visa ae ec jcb';

        changeSelect(idSelect, idCardImg);

        idSelect.on('change', function () {
            changeSelect(idSelect, idCardImg);
        });

        idCardIcons.on('click', 'li', function () {
            changeCardIcon($(this), idCardImg, idSelect);
        });

        function changeCardIcon(idCardIcons, idCardImg, idSelect) {
            var thisIcon = idCardIcons.attr('class');
            if (idCardImg.attr('class') !== thisIcon) {
                idCardImg.removeClass(cardClass).addClass(thisIcon);
                idSelect.find('option').each(function () {
                    if ($(this).val() === thisIcon) {
                        idSelect.find('option').prop('selected', false);
                        $(this).prop('selected', true).trigger('refresh');
                    }
                });
            }
        }

        function changeSelect(idSelect, idCardImg) {
            var selectOptionValue = idSelect.find(':selected').val();
            if (idCardImg.attr('class') !== selectOptionValue) {
                idCardImg.removeClass(cardClass).addClass(selectOptionValue);
            }
        }

    });

}(jQuery));
