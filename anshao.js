/**
 * Created by SamMFFL on 16/7/25.
 */
define(['zepto',
    'artTemplate',
    'text!views/title.html',
    'text!views/chatRoom.html',
    'text!views/anshaoAnswer.html',
    'text!views/myQuestion.html',
    'text!views/dialog.html'
], function ($, template, titleTpl, chatRoomTpl, anshaoAnswerTpl, myQuestionTpl, dialogTpl) {
    var anshao = {
        MESSAGE_HISTORY: "anshaoMessageHistory",
        CLIENT_NO: '',
        hasHistory: false,
        history: {
            greeting: '恭喜你,进入安少朋友圈。本少混迹金融圈，不坏有涵养，只想带你一起吃喝玩乐还赚high。有什么可以为您效劳的？',
            errorMessage: '本少爷思考人生中...',
            avatarAnshao: '',
            deadline: 7 * 24 * 60 * 60 * 1000
        },
        /**
         * 初始化生成history对象,把安少头像和用户头像存到本地
         * @param clientNo
         * @returns {*}
         */
        init: function (clientNo) {
            var deferred = $.Deferred();
            this.CLIENT_NO = clientNo;
            if (!!this.getLocalStorage('anshaoMessageHistory')) {
                this.history = JSON.parse(this.getLocalStorage('anshaoMessageHistory'));
                this.hasHistory = true;
            } else {
                this.history[clientNo] = {
                    avatar: '',
                    messages: []
                };
            }
            this.history['greeting'] = '恭喜你,进入安少朋友圈。本少混迹金融圈，不坏有涵养，只想带你一起吃喝玩乐还赚high。有什么可以为您效劳的？';
            console.log(this.history);
            //从资源里面获取安少头像存到本地
            this.getAvatarData('anshoa.jpg').then(function (imgData) {
                anshao.history['avatarAnshao'] = imgData;
                console.log('anshaotouiang')
            }, function (error) {
                console.log(error);
            }).then(function () {
                console.log(1234)
                //todo ajax获取用户头像,存入对应clientNo中
                anshao.getAvatarData('16114J015-6.jpg').then(function (imageData) {
                    anshao.history[clientNo]["avatar"] = imageData;
                    anshao.setLocalStorage(anshao.MESSAGE_HISTORY, JSON.stringify(anshao.history));
                    deferred.resolve();
                }, function (e) {
                    console.log(e);
                });
            });

            return deferred;
        },
        /**
         * 创建聊天室
         * 获取历史记录
         * 请求安少问候语
         * @param container
         * @returns {*}
         */
        createChatRoom: function (container) {
            var deferred = $.Deferred();
            var $chatRoom = $(template.compile(chatRoomTpl)());

            var messages = this.history[this.CLIENT_NO]['messages'];
            var deleteIndexes = [];
            var i, max;
            var deadline = new Date().getTime() - this.history.deadline;

            for (i = 0, max = messages.length; i < max; i++) {
                if (deadline > messages[i].timestamp) {
                    deleteIndexes.push(i);
                    continue;
                }

                $chatRoom.append(this.getTemplateDom(myQuestionTpl, {
                    question: messages[i].question,
                    avatar: this.history[this.CLIENT_NO]['avatar']
                })).append(this.getTemplateDom(anshaoAnswerTpl, {
                    answer: messages[i].answer,
                    avatar: this.history['avatarAnshao']
                }));
            }

            for (i = deleteIndexes.length - 1; i >= 0; i--) {
                //去掉对应clientNo过期信息
                messages.splice(deleteIndexes[i], 1);
            }
            // console.log(messages);
            this.history[this.CLIENT_NO]['messages'] = messages;
            this.setLocalStorage(this.MESSAGE_HISTORY, JSON.stringify(this.history));


            //todo ajax请求安少问候语
            var text = (this.hasHistory && messages.length > 0) ? '<hr class="history_line" />' : '';
            // console.log(anshao.history['avatar'])
            $chatRoom.append(text).append(this.getTemplateDom(anshaoAnswerTpl, {
                answer: anshao.history.greeting,
                avatar: anshao.history['avatarAnshao']
            }));

            $('.navtitle').hide();
            $(container).append(this.getTemplateDom(titleTpl, {}))
                .append($chatRoom).append(this.getTemplateDom(dialogTpl, {}));

            $('.close_chat_room').bind('touchend', function () {
                $('.chat_room_title').remove();
                $('.chat_room').remove();
                $('.dialog').remove();
                $('.navtitle').show();
            })

            deferred.resolve();

            return deferred;
        },


        /**
         * 用户提问ajax请求安少回答
         * beforeSend添加用户提问
         * @param message
         */
        askQuestion: function (message) {
            var question = message,
                answer = '';
            $.ajax({
                url: '/chat/question',
                type: 'POST',
                data: {question: question, clientNo: anshao.CLIENT_NO},
                dataType: 'json',
                timeout: 6 * 1000,
                beforeSend: function (xhr, settings) {
                    // console.log(1)

                    console.log(message, anshao.len(message));


                    if (!!message && anshao.len(message) > 300) {
                        alert('您输入的内容过长');
                        return false;
                    }
                    if (!message || !anshao.len(message)) {
                        alert('请输入内容');
                        return false;
                    }

                    $('.chat_room').append(anshao.getTemplateDom(myQuestionTpl, {
                        question: question,
                        avatar: anshao.history[anshao.CLIENT_NO]['avatar']
                    }))

                },
                success: function (data, status, xhr) {
                },
                error: function (xhr, errorType, error) {
                    answer = anshao.history['errorMessage'];
                    $('.chat_room').append(anshao.getTemplateDom(anshaoAnswerTpl, {
                        answer: answer,
                        avatar: anshao.history['avatarAnshao']
                    }));
                },
                complete: function (xhr, status) {
                    anshao.saveDialog(question, answer);
                }
            })


            // $('.chat_room').append(this.getTemplateDom(myQuestionTpl, {
            //         question: question,
            //         avatar: anshao.history[this.CLIENT_NO]['avatar']
            //     }))
            //     .append(this.getTemplateDom(anshaoAnswerTpl, {
            //         answer: answer,
            //         avatar: anshao.history['avatarAnshao']
            //     }));
            //
            // this.saveDialog(question, answer);

            $('#message').val('');
        },
        saveDialog: function (question, answer) {
            this.history[this.CLIENT_NO]['messages'].push({
                question: question,
                answer: answer,
                timestamp: new Date().getTime()
            });
            this.setLocalStorage(this.MESSAGE_HISTORY, JSON.stringify(this.history));
            this.scrollToEnd();
        },
        /**
         * 返回模版dom对象  chatRoomTpl|anshaoAnswerTpl|myQuestionTpl|dialogTpl
         * @param tpl
         * @param msg
         * @returns {jQuery|HTMLElement}
         */
        getTemplateDom: function (tpl, msg) {
            // console.log($(template.compile(tpl)(msg)))
            return $(template.compile(tpl)(msg));
        },


        getLocalStorage: function (key) {
            return window.localStorage.getItem(key);

        },
        setLocalStorage: function (key, value) {
            window.localStorage.setItem(key, value);
        },
        /**
         * 进入聊天室添加完历史记录,滚轮滚到最下方
         * 每次聊天内容发送滚轮往下滚动到底部
         */
        scrollToEnd: function () {
            $('.chat_room')[0].scrollTop = $('.chat_room')[0].scrollHeight
        },
        /**
         * 获取字符串长度,限定中文字不多于150个字
         * @param s
         * @returns {boolean}
         */
        len: function (s) {
            var l = 0;
            var a = s.split("");
            for (var i = 0; i < a.length; i++) {
                if (a[i].charCodeAt(0) < 299) {
                    l++;
                } else {
                    l += 2;
                }
            }
            return l;
        },

        getAvatarData: function (imgUrl) {
            var deferred = $.Deferred();
            var img = document.createElement('img');
            img.addEventListener('load', function () {
                var imgCanvas = document.createElement("canvas"),
                    imgContext = imgCanvas.getContext('2d');
                imgCanvas.width = this.width;
                imgCanvas.height = this.height;
                imgContext.drawImage(this, 0, 0, this.width, this.height);
                var imgAsDataURL = imgCanvas.toDataURL("image/png");
                // console.log(imgAsDataURL)
                try {
                    // console.log(anshao.CLIENT_NO);
                    if (imgAsDataURL) {
                        // console.log('test')
                        deferred.resolve(imgAsDataURL);
                    } else {
                        deferred.reject('没有转换成功');
                    }
                } catch (e) {
                    console.log("storage failed: " + e);
                    deferred.reject(e);
                }
            }, false);
            img.src = imgUrl;//图片加载
            return deferred;

        }


    }

    return anshao;
})