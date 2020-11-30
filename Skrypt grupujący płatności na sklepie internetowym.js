function PaymentSection() {
    return {
        mainWrapperPayments: $('.order1_payitems_wrapper'),
        header: null,
        id: null,
        self: null,
        init: function (header, id) {
            this.header = header;
            this.id = id;
            var section = '<div class="order1_payment_wrapper clearfix new"><strong id="section' + this.id + 'Header" class="sectionHeader">' + this.header + ' <i class="fas fa-bars"></i></strong> <div id="' + id + 'Wrapper" class="paymentsWrapper"></div></div>';
            this.mainWrapperPayments.prepend(section);
            this.self = $('#' + id + 'Wrapper');
            console.log(this.id);
            this.createClickEvent();
        },
        append: function (itemPayment) {
            this.self.append($(itemPayment));
        },
        createClickEvent: function () {
            var isMobile = $(window).width() <= 756;
            var self = this;
            if (isMobile) {
                $('#section' + this.id + 'Header').click(function () {
                    var wrapper = ('#' + self.id + 'Wrapper');
                    var isInvisible = $(wrapper).css('display') == 'none';
                    if (isInvisible) {
                        $('#' + self.id + 'Wrapper').css('display', 'block');
                    } else {
                        $('#' + self.id + 'Wrapper').css('display', 'none');
                    }
                })
            }
        }
    };
}

function SortPayment() {
    return {
        cardPaymentsSection: null,
        transferPaymentsSection: null,
        otherPaymentsSection: null,
        init: function () {
            this.createSection();
            var rowPayments = $('.order1_payitems_wrapper').find(".order1_payment_wrapper");
            var self = this;
            jQuery.each(rowPayments, function (index, el) {
                jQuery.each($(el).find('.order1_payment'), function (index, itemPayment) {
                    var idPayment = $(itemPayment).find('input[name="payform_id"]').val();
                    if (self.isCardPayment(idPayment)) {
                        self.cardPaymentsSection.append(itemPayment);
                        return;
                    }

                    if (self.isTransferPayment(idPayment)) {
                        self.transferPaymentsSection.append(itemPayment);
                        return;
                    }
                    self.otherPaymentsSection.append(itemPayment);
                });
            });
        },
        createSection: function () {
            this.otherPaymentsSection = new PaymentSection();
            this.otherPaymentsSection.init('Pozostałe', 'otherPayments');

            this.transferPaymentsSection = new PaymentSection();
            this.transferPaymentsSection.init('Przelewy bankowe:', 'transferPayments');


            this.cardPaymentsSection = new PaymentSection();
            this.cardPaymentsSection.init('Płatności kartą:', 'cardPayments');
        },
        isCardPayment: function (idPayment) {
            var card = ["173", "50", "44", "169", '45', '46'];
            return card.indexOf(idPayment) >= 0;
        },
        isTransferPayment: function (idPayment) {
            var transfer = ["4", "9", "36", "11", "213", "158", "135", "10", "17", "28", "20", "22", "167", "156", "24", "25", "37", "126", "191", "183", "41", "170", "26", "179", "214", "14", "40", "153", "42"];
            return transfer.indexOf(idPayment) >= 0;
        },
        isOtherPayment: function (idPayment) {
            var other = ["132", "119", "203", "110", "177", " "];
            return other.indexOf(idPayment) >= 0;
        },
    };
}

$(document).ready(function () {
    var allowser = ["User2", "User"]
    var allow = $('#menu_additional').find('label').text();
    if (allowUSer.indexOf(allow) >= 0) {
        var isSelectedBeforeShipping = $('#delivery_0-1').find('input').attr('checked') != undefined
        var isSelectedBeforeShippingNonstandard = $('#delivery_10-1').find('input').attr('checked') != undefined
        if (isSelectedBeforeShipping || isSelectedBeforeShippingNonstandard) {
            var sortPayment = new SortPayment();
            sortPayment.init();
        } else {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutationRecord) {
                    console.log('style changed!');
                    var sortPayment = new SortPayment();
                    sortPayment.init();
                });
                this.disconnect();
            });
            var target = document.getElementById('order1_payform');
            observer.observe(target, { attributes: true, attributeFilter: ['style'] });
        }
    }
});