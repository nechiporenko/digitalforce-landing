jQuery(document).ready(function ($) {
    //валидируем поля формы с классом js-validate
    //параметры валидации передаем через data-атрибуты data-validate
    //возможны 3 варианта:
    //required - поле обязательно для заполнения
    //phone - тел.номер (обязательно для заполнения)
    //email - email (обязательно для заполнения)
    //для select (required) - проверяем значения value. Если value==='label' - скрипт вернет ошибку

    var Validate = (function () {
        var method = function (form) {
            this.frm = form;
            this.formID = this.frm.getAttribute('id');
            this.inputs = this.frm.getElementsByClassName('js-validate');//поля которые нужно валидировать
            this.count = this.inputs.length;//кол-во полей
        };


        method.prototype.checkForm = function () {
            var errors = 0,//кол-во ошибок
                isFormValid = false;//результат проверки полей

            for (var i = 0; i < this.count; i++) {
                var elem_val = this.inputs[i].value,
                    valid_type = this.inputs[i].getAttribute('data-validate');

                switch (valid_type) {//3 типа - required, phone, email
                    case 'required':
                        var elem_type = this.inputs[i].tagName.toLowerCase();
                        if (elem_type === 'input' || elem_type == 'textarea') {//если поле - input или textarea
                            this.checkRequiredInput(this.inputs[i], elem_val);
                            if (!this.checkRequiredInput(this.inputs[i], elem_val)) {
                                errors++;
                            }
                        } else {//если поле - select
                            if (!this.checkRequiredSelect(this.inputs[i], elem_val)) {
                                errors++;
                            }
                        };
                        break;
                    case 'phone':
                        if (!this.checkPhone(this.inputs[i], elem_val)) {
                            errors++;
                        };
                        break;
                    case 'email':
                        if (!this.checkEmail(this.inputs[i], elem_val)) {
                            errors++;
                        };
                        break;
                };
            };

            if (errors === 0) {//если нет ошибок в полях
                isFormValid = true;
            };
            return isFormValid;
        };

        method.prototype.checkRequiredInput = function (el, val) {//если обязательное поле
            var result = false;
            if (val.length > 0) {
                result = true;
                this.removeErrorClass(el);
            } else {
                this.addErrorClass(el);
            };
            return result;
        };

        method.prototype.checkRequiredSelect = function (el, val) {//если обязателен селект
            var result = false;
            if (val !== 'label') {//если значение селекта label - вернем ошибку!!!
                result = true;
                this.removeErrorClass(el);
            } else {
                this.addErrorClass(el);
            };
            return result;
        };

        method.prototype.checkPhone = function (el, val) {//телефон. Разрешаем +, цифры, тире, пробелы, скобки
            var result = false,
                reg = /^[\d\+]+[\d\(\)\ -]{4,20}\d$/;
            if (reg.test(val) && val.length <= 20) {//разрешим не более 20 символов
                result = true;
                this.removeErrorClass(el);
            } else {
                this.addErrorClass(el);
            };
            return result;
        };

        method.prototype.checkEmail = function (el, val) {//email
            var result = false,
                reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (reg.test(val)) {
                result = true;
                this.removeErrorClass(el);
            } else {
                this.addErrorClass(el);
            };
            return result;
        };

        method.prototype.addErrorClass = function (el) {//покажем сообщение об ошибке
            $(el).parents('.g-fieldset').addClass('error');
        };

        method.prototype.removeErrorClass = function (el) {//скроем сообщение об ошибке
            $(el).parents('.g-fieldset').removeClass('error');
        };

        method.prototype.clearForm = function () {//очистим поля формы
            for (var i = 0; i < this.count; i++) {
                var elem_type = this.inputs[i].tagName.toLowerCase();
                if (elem_type === 'input'  || elem_type === 'textarea') {//если input, textarea
                    this.inputs[i].value = '';
                } else {//select
                    this.inputs[i].value = 'label';
                }
            };
        };

        method.prototype.showOkMsg = function () {
            $('#thanks').popup('open');//покажем сообщение (универсальное) что все ОК
        };

        return method;
    })();


    //Форма в модальном окне
    var request_form = document.getElementById('request_form'),
        request = new Validate(request_form);
    request_form.addEventListener('submit', request_send.bind(request));

    function request_send(e) {
        e.preventDefault();//вырубили стандартную отправку
        var check_result = request.checkForm(); //проверяем поля

        if (check_result) {//если форма прошла проверку
            //пример обработчика
            console.log('Отправляем форму ' + this.formID);
            /// отправка
            var data = $(request_form).serialize();
            $.ajax({
                //type: 'POST',
                //url: 'example.php',
                //dataType: 'json',
                data: data,
                beforeSend: function (data) {
                    $(request_form).find('button[type="submit"]').attr('disabled', 'disabled');//блокируем кнопку на время отправки данных
                },
                success: function (data) {
                    if (data['error']) {
                        alert(data['error']);
                    } else { // ok
                        request.clearForm();//очистили поля формы
                        $('#request').popup('close');//закрыли родительское модальное окно
                        request.showOkMsg();//показали сообщение что все ОК
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {//если ошибки
                    alert(xhr.status);
                    alert(thrownError);
                },
                complete: function (data) {
                    $(request_form).find('button[type="submit"]').removeAttr('disabled');//разблокировали кнопку отправки
                }
            });

        } else {
            console.log('Форма содержит ошибки!');
        }
    }

    //Контактная форма
    var contact_form = document.getElementById('contact_form'),
        contact = new Validate(contact_form);
    contact_form.addEventListener('submit', contact_send.bind(contact));

    function contact_send(e) {
        e.preventDefault();//вырубили стандартную отправку
        var check_result = contact.checkForm(); //проверяем поля

        if (check_result) {//если форма прошла проверку
            //пример обработчика
            console.log('Отправляем форму ' + this.formID);
            /// отправка
            var data = $(contact_form).serialize();
            $.ajax({
                //type: 'POST',
                //url: 'example.php',
                //dataType: 'json',
                data: data,
                beforeSend: function (data) {
                    $(contact_form).find('button[type="submit"]').attr('disabled', 'disabled');//блокируем кнопку на время отправки данных
                },
                success: function (data) {
                    if (data['error']) {
                        alert(data['error']);
                    } else { // ok
                        contact.clearForm();//очистили поля формы
                        contact.showOkMsg();//показали сообщение что все ОК
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {//если ошибки
                    alert(xhr.status);
                    alert(thrownError);
                },
                complete: function (data) {
                    $(contact_form).find('button[type="submit"]').removeAttr('disabled');//разблокировали кнопку отправки
                }
            });

        } else {
            console.log('Форма содержит ошибки!');
        }
    }
});