/**
 * Created by SamMFFL on 16/7/22.
 */

define([
    'zepto',
    'artTemplate',
    'text!views/chatRoom.html',
    'text!views/anshaoAnswer.html',
    'text!views/myQuestion.html',
    'text!views/dialog.html',
], function ($, template, chatRoomTpl, anshaoAnswerTpl, myQuestionTpl, dialogTpl) {
    var ept = {
        count: 0,
        init: function () {
            //点击安少问答
            $('#call').bind('touchend', function () {
                var $chatRoom = $(template.compile(chatRoomTpl)());
                //todo localStorage 查询对应clientNo的历史对话

                //todo 需要ajax请求问候语
                $chatRoom.append($(template.compile(anshaoAnswerTpl)({
                    answer: '欢迎进入安少问答',
                    time: "" + new Date()
                })));
                var $dialog = $(template.compile(dialogTpl)());
                $('body').append($chatRoom).append($dialog);

                //发问
                $('.dialog_submit').bind('touchend', function () {
                    //todo ajax 请求问答
                    $('.chat_room').append($(template.compile(myQuestionTpl)({
                            question: $('#message').val() || '我的提问' + ept.count++,
                            time: '' + new Date()
                        })))
                        .append($(template.compile(anshaoAnswerTpl)({
                            answer: '安少回答' + Math.random(),
                            time: '' + new Date()
                        })));


                    $('#message').val('');
                });


            });
        }
    };

    return ept;
});