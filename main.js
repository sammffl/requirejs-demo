/**
 * Created by SamMFFL on 16/7/22.
 */

define([
    'zepto',
    './anshao',
    // 'artTemplate',
    // 'text!views/chatRoom.html',
    // 'text!views/anshaoAnswer.html',
    // 'text!views/myQuestion.html',
    // 'text!views/dialog.html',
], function ($, anshao/*$, anshao, template, chatRoomTpl, anshaoAnswerTpl, myQuestionTpl, dialogTpl */) {
    var ept = {
        count: 0,
        init: function () {

            $('#call_anshao').bind('touchend', function () {


                //需要传入clientNo
                anshao.init('12345').then(function () {
                    anshao.createChatRoom('body').then(function () {
                        anshao.scrollToEnd();
                        $('.dialog_submit').bind('touchend', function () {
                            anshao.askQuestion($('#message').val())
                        });
                    });
                });


                // anshao.createChatRoom('body', '12345').then(function () {
                //     // $('.chat_room')[0].scrollTop($('.chat_room')[0].scrollHeight);
                //     // $('.chat_room')[0].scrollTop = $('.chat_room')[0].scrollHeight
                //     anshao.scrollToEnd();
                //     $('.dialog_submit').bind('touchend', function () {
                //         anshao.askQuestion($('#message').val())
                //     });
                // });
            })
        }
    };

    return ept;
});