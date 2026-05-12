/*
 * MultiSelect Transfer 2.0, jQuery plugin
 *
 * Copyright(c) 2012, Maksim Bikov ,maksim.bikov@gmail.com.
 *
 * Creating two multiselect elements from one original and splitting selected options from one to another.
 * You may setup 'disable'(in `transfer_way` param) to disable selected options from left list over deleting them
 */

(function($){
    $.fn.extend({
        multiselectTransfer: function(options) {
            var i = 0;
            //Settings list and the default values
            var defaults = {
                transfer_way: 'remove',                // or 'remove'
                left_div: 'leftdiv',                // cloned select container's id name
                right_div: 'rightdiv',                // where we transfer selected options
                original_div: 'original_select',    // original select container's class name
                add_class: 'transfer_add',            // button class name
                remove_class: 'transfer_remove',    // button class name
                use_ui: true,                        // do we have jquery ui enabled
                need_sort: true,                    // to sort values after deselect, works with transfer_way = 'remove'
                remove_select_after_action: false,    // to deselect from left/right selects after add/remove action
                width_prefix: 10                    // space between SELECTs
            };

            var options = $.extend(defaults, options);

            function sort_options (div_obj)
            {
                if (options.transfer_way != 'disable' && options.need_sort)
                {
                    // Loop for each select element on the page.
                    $('select', div_obj).each(function() {

                        // Keep track of the selected option.
                        var selectedValue = $(this).val();

                        // Sort all the options by text. I could easily sort these by val.
                        $(this).html($("option", $(this)).sort(function(a, b) {
                            return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
                        }));

                        // Select one option.
                        $(this).val(selectedValue);
                    });
                }
                if (options.remove_select_after_action)
                {
                    $('select option:selected', div_obj).removeAttr("selected");
                }
            }

            function preselect_options (transfered_select, original_select)
            {
                $('option', original_select).removeAttr("selected");

                $('option', transfered_select).each(function(){
                    $("option[value='"+$(this).val()+"']", original_select).attr("selected", "selected");
                });
            }

            function refill_transfer (container_obj)
            {
                $('.'+options.right_div+' select option, .'+options.left_div+' select option', container_obj)
                .removeAttr('selected');
                switch(options.transfer_way)
                {
                case 'disable':
                    // removing all current selected values and filling back left select
                    var items = $('.'+options.right_div+' select option', container_obj);

                    items.each(function(){
                        // $('.'+cloned_id+' select [value="'+$(this).val()+'"]').removeAttr('disabled');
                        $("."+options.left_div+" select option[value='"+$(this).val()+"']", container_obj).removeAttr('disabled');
                    });

                    items.remove();

                    // refilling new values
                    $('.'+options.original_div+' select option:selected', container_obj).each(function()
                    {
                        var item = $("."+options.left_div+" select option[value='"+$(this).val()+"']", container_obj);
                        item.clone().appendTo($('.'+options.right_div+' select', container_obj));
                        item.attr('disabled','disabled');
                    });
                    break;
                default:
                    // removing all current selected values and filling back left select
                    $('.'+options.right_div+' select option', container_obj)
                        .remove()
                        .appendTo($('.'+options.left_div+' select', container_obj));

                    // refilling new values
                    $('.'+options.original_div+' select option:selected', container_obj).each(function()
                    {
                        $("."+options.left_div+" select option[value='"+$(this).val()+"']", container_obj)
                            .remove()
                            .appendTo($('.'+options.right_div+' select', container_obj))
                            ;
                    });
                    break;
                }
            }

            switch(options.transfer_way)
            {
            case 'disable':
                $('.transfer_container .'+options.add_class).live('click', function() {
                    var $container = $(this).parent().parent();
                    var items = $('.'+options.left_div+' select option:selected', $container);
                    var dest_box = $('.'+options.right_div+' select', $container);
                    var swidth =  dest_box.css('width').split('px')[0];

                    $('.'+options.right_div+' select', $container).append(items.clone());

                    items.attr('disabled','disabled').removeAttr('selected');

                    preselect_options($('.'+options.right_div+' select', $container), $('.'+options.original_div+' select', $container));

                    dest_box.css('width', swidth + 1 + 'px');
                    dest_box.css('width', swidth + 'px');

                    return false;
                });
                $('.transfer_container .'+options.remove_class).live('click', function() {
                    var $container = $(this).parent().parent();
                    var left_div_obj = $('.'+options.left_div, $container);
                    var items = $('.'+options.right_div+' select option:selected', $container);
                    var dest_box = $('.'+options.left_div+' select', $container);
                    var swidth =  dest_box.css('width').split('px')[0];

                    items.each(function(){
                        // maybe better to use values - did not decide it yet
                        // $('select [value="'+$(this).val()+'"]', left_div_obj).removeAttr('disabled');
                        $("select option[value='"+$(this).val()+"']", left_div_obj).removeAttr('disabled');
                    });

                    items.remove();

                    preselect_options($('.'+options.right_div+' select', $container), $('.'+options.original_div+' select', $container));

                    // double redraw select box -- IE9 bug
                    dest_box.css('width', swidth + 1 + 'px');
                    dest_box.css('width', swidth + 'px');

                    return false;
                });
                break;
            default:

                $('.transfer_container .'+options.add_class).live('click', function() {
                    var $container = $(this).parent().parent();
                    var dest_box = $('.'+options.right_div+' select', $container);
                    var swidth =  dest_box.css('width').split('px')[0];
                    if ($('.'+options.left_div+' select option:selected', $container).length < 1)
                    {
                        return false;
                    }
                    $('.'+options.left_div+' select option:selected', $container)
                        .remove()
                        .appendTo($('.'+options.right_div+' select', $container))
                        ;

                    sort_options($('.'+options.right_div, $container));

                    preselect_options($('.'+options.right_div+' select', $container), $('.'+options.original_div+' select', $container));

                    $('div.'+options.right_div+ '> select').trigger('transferChangeEvent');

                    dest_box.css('width', swidth + 1 + 'px');
                    dest_box.css('width', swidth + 'px');

                    return false;
                });
                $('.transfer_container .'+options.remove_class).live('click', function() {
                    var $container = $(this).parent().parent();
                    var dest_box = $('.'+options.left_div+' select', $container);
                    var swidth =  dest_box.css('width').split('px')[0];

                    if ($('.'+options.right_div+' select option:selected', $container).length < 1)
                    {
                        return false;
                    }

                    $('.'+options.right_div+' select option:selected', $container)
                        .remove()
                        .appendTo($('.'+options.left_div+' select', $container));

                    sort_options($('.'+options.left_div, $container));

                    preselect_options($('.'+options.right_div+' select', $container), $('.'+options.original_div+' select', $container));

                    $('div.'+options.right_div+ '> select').trigger('transferChangeEvent');

                    // double redraw select box -- IE9 bug
                    dest_box.css('width', swidth + 1 + 'px');
                    dest_box.css('width', swidth + 'px');

                    return false;
                });
                break;
            }

                var o = options;
                var add = o.use_ui ?
                '<a href="javascript:;" class="'+o.add_class+' ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-secondary" role="button" aria-disabled="false"><span class="ui-button-text">add</span><span class="ui-button-icon-secondary ui-icon ui-icon-seek-next"></span></a>'
                : '<a href="#" class="simple '+o.add_class+'">add &gt;&gt;</a>'
                ;

                var remove = o.use_ui ?
                '<a href="javascript:;" class="'+o.remove_class+' ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-seek-prev"></span><span class="ui-button-text">remove</span></a>'
                : '<a href="#" class="simple '+o.remove_class+'">&lt;&lt; remove</a>'
                ;

            return this.each(function() {
                var o = options;

                // Assign current element to variable, in this case is SELECT element
                var obj = $(this);
                if (typeof(obj.attr('multiple')) === 'undefined' || obj.hasClass('multitransfer'))
                {
                    // we don't need strange tags here
                    return true;
                }

                // Let create some space between 2 lists
                var div_w = o.width_prefix + 150;

                // Simply inserting new html over old one
                obj.wrap('<div class="transfer_container" />').wrap('<div class="'+o.original_div+'" />');
                var $container = obj.parent().parent();

                $container.append('<div class="'+o.left_div+'" style="float:left;width:'+div_w+'px">' + add + '</div><div class="'+o.right_div+'" style="float:left;width:150px">' + remove + '</div><div style="clear:both;"></div>');

                // Now we should fill 2 new DIV elements with same data from original SELECT
                $('.'+o.left_div+', .'+o.right_div, $container).prepend(obj.clone());

                // Removing 'name' param from cloned SELECT to prevent submiting it in FORM
                $('.'+o.left_div+' select, .'+o.right_div+' select', $container).attr('name', '')
                    .removeAttr('class')
                    .addClass('multitransfer');
                // We don't need whole list in this SELECT, only selected options from stored object
                $('.'+o.right_div+' select option', $container).remove();
                // And now we need to fill up selected options from stored object
                $('.'+o.right_div+' select', $container).append($('.'+o.left_div+' select option:selected', $container).clone().removeAttr('selected'));
                // And here we should disable/remove selected values from cloned SELECT
                switch(o.transfer_way)
                {
                case 'disable':
                    $('.'+o.left_div+' select option:selected', $container).attr('disabled','disabled').removeAttr('selected');
                    break;
                default:
                    $('.'+o.left_div+' select option:selected', $container).remove();
                    break;
                }

                obj.addClass('multitransfer').parent().hide();
                preselect_options($('.'+o.right_div+' select', $container), $('.'+o.original_div+' select', $container));

                // assigning actions on add/remove buttons
                $('.transfer_container .'+options.original_div+' select[name^="'+obj.attr('name')+'"]').live('change', function() {
                    refill_transfer($(this).parent().parent());
                });

            });

        }
    });
})(jQuery);