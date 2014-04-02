/*
 *   Copyright (C) 2014 Xinguard Inc.
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:

 *   The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.

 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *   THE SOFTWARE.
 */

function select_switch_dpid_from_list() {
    $("#sw_select li a").on("click", function(event) {
        $("#sw_select_title").text($(this).text());
        dpid = $(this).text();
        //get_switch_port(dpid);
        //get_flow_table(dpid);
    });

}


function check_flow_table() {
    $("input[name=flow_checkbox]").click(function() {
        if ($("#delete_btn").css("display") == "none") {
            $("#delete_btn").show();
        }
    });
}

function check_all_flow_table() {
    $("input[name=flow_checkbox_all]").click(function() {
        if ($(this).prop("checked")) {
            $("input[name=flow_checkbox]").each(function() {
                $("#delete_btn").show();
                $(this).prop("checked", true);
            });
        } else {
            $("input[name=flow_checkbox]").each(function() {
                $("#delete_btn").hide();
                $(this).prop("checked", false);
            });
        }
    });
}

var flow_table_checkbox = function() {
    $("input[name=flow_checkbox]").click(function() {
        $("input[name=flow_checkbox]").each(function(index, value) {
            if ($(this).is(":checked")) {
                //$("#flow_entry tbody tr:eq(" + index + ")")
                $("#delete_btn").show();
                return false
            }
            else {
                $("#delete_btn").hide();
            }
        });
    });
}

var delete_flow_click = function() {
    $("#delete_btn").click(function() {
        $("input[name=flow_checkbox]").each(function(index, value) {
            if ($(this).is(":checked")) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: $SCRIPT_ROOT + "/_del_flow",
                    data: {
                        index: index
                    },
                    success: function(data) {},
                    complete: function(data) {
                        location.reload();
                    }
                });
            }
        });
    });
}

var dropdown_menu_freeze = function() {
    $(".dropdown-menu").click(function(event) {
           event.stopPropagation();
           //event.preventDefault() 
    });
} 

var form_control = function() {
    priority_form_click();
    idle_form_click();
    hard_form_click();
 
    input_form_click();
    dl_saddr_form_click();
    dl_daddr_form_click();
    nw_saddr_form_click();
    nw_daddr_form_click();
    l4_proto_form_click();
    sport_form_click();
    dport_form_click();
    vlan_id_form_click();

    output_form_click();
    vlan_action_form_click();

    confirm_form_click();
    reset_form_click();
}

var common_form_validate = function(common_data) {
    var regex = /\d/;
    if (regex.test(common_data) && (common_data >= 0 && common_data < 65536)) {
        return true;
    }
    //console.log("common_form_validate fail");
    return false;
}

var priority_form_click = function() {
    $("#priority_btn").click(function() {
            if (common_form_validate(parseInt($("#priority").val()))) {
                $("#priority_link").text($("#priority").val());
                $(".dropdown.open").removeClass("open");
                $(".priority_div ul li input").css("border-color", "");
                $(".priority_div ul li input").css("border-width", "");
                $("#priority").val("");
            }
            else {
                $(".priority_div ul li input").css("border-color", "red");
                $(".priority_div ul li input").css("border-width", "2px");
            }
            
    });
}

var idle_form_click = function() {
    $("#idle_btn").click(function() {
            if (common_form_validate(parseInt($("#idle").val()))) {
                $("#idle_link").text($("#idle").val());
                $(".dropdown.open").removeClass("open");
                $(".idle_div ul li input").css("border-color", "");
                $(".idle_div ul li input").css("border-width", "");
                $("#idle").val("");
            }
            else {
                $(".idle_div ul li input").css("border-color", "red");
                $(".idle_div ul li input").css("border-width", "2px");
            }
    });
}

var hard_form_click = function() {
    $("#hard_btn").click(function() {
            if (common_form_validate(parseInt($("#hard").val()))) {
                $("#hard_link").text($("#hard").val());
                $(".dropdown.open").removeClass("open");
                $(".hard_div ul li input").css("border-color", "");
                $(".hard_div ul li input").css("border-width", "");
                $("#hard").val("");
            }
            else {
                $(".hard_div ul li input").css("border-color", "red");
                $(".hard_div ul li input").css("border-width", "2px");
            }
    });
}

var input_form_click = function() {
    $("#input_btn").click(function() {
            var checked = $(".input_div ul li .input_radio_div input[type='radio']:checked").val();
            if (checked == 0) {
                $("#input_link").text("Any");
            }
            else {
                $("#input_link").text(checked);
            }
            $(".dropdown.open").removeClass("open");
            for (i = 0; i < $(".input_div ul li .input_radio_div input[type='radio']").length; i++) {
                $(".input_div ul li .input_radio_div input[type='radio']").prop("checked", false);
            }
    });
}

var dl_addr_form_validate = function(dl_addr_data) { 
    var regex = /[0-9A-Fa-f]{2}/;
    if (regex.test(dl_addr_data)) {
        return true;
    }

    //console.log("dl_addr_form_validate");
    return false;
}

var dl_saddr_form_click = function() {
    $("#dl_saddr_btn").click(function() {
        var ret = "";
        var validate = true;
        for (i = 0; i < 6; i++) {
            if (dl_addr_form_validate($(".dl_saddr_div ul li input:eq(" + i + ")").val())) {
                ret += $(".dl_saddr_div ul li input:eq(" + i + ")").val();
                if (i < 5) {
                    ret += ":";
                }
            }
            else {
                validate = false;
                break;
            }
        }

        $(".dl_saddr_div ul li input").css("border-color", "");
        $(".dl_saddr_div ul li input").css("border-width", "");
        if (validate) {
            $("#dl_saddr_link").text(ret);
            $(".dropdown.open").removeClass("open");

            for (i = 0; i < 6; i++) {
                $(".dl_saddr_div ul li input:eq(" + i + ")").val("");
            }
        }
        else {
            $(".dl_saddr_div ul li input:eq(" + i + ")").css("border-color", "red");
            $(".dl_saddr_div ul li input:eq(" + i + ")").css("border-width", "2px");
        }
    });
}

var dl_daddr_form_click = function() {
    $("#dl_daddr_btn").click(function() {
        var ret = "";
        var validate = true;
        for (i = 0; i < 6; i++) {
            if (dl_addr_form_validate($(".dl_daddr_div ul li input:eq(" + i + ")").val())) {
                ret += $(".dl_daddr_div ul li input:eq(" + i + ")").val();
                if (i < 5) {
                    ret += ":";
                }
            }
            else {
                validate = false;
                break;
            }
        }

        $(".dl_daddr_div ul li input").css("border-color", "");
        $(".dl_daddr_div ul li input").css("border-width", "");
        if (validate) {
            $("#dl_daddr_link").text(ret);
            $(".dropdown.open").removeClass("open");

            for (i = 0; i < 6; i++) {
                $(".dl_daddr_div ul li input:eq(" + i + ")").val("");
            }
        }
        else {
            $(".dl_daddr_div ul li input:eq(" + i + ")").css("border-color", "red");
            $(".dl_daddr_div ul li input:eq(" + i + ")").css("border-width", "2px");
        }
    });
}

var nw_addr_form_validate = function(nw_addr_data) {
    var regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (regex.test(nw_addr_data)) {
        return true;
    }

    //console.log("nw_addr_form_validate");
    return false;
}

var nw_addr_form_cidr_validate = function(nw_addr_data) {
    var regex = /\d/;
    if (regex.test(nw_addr_data) && (nw_addr_data >= 0 && nw_addr_data <= 32)) {
        return true;
    }
    return false;
}

var nw_saddr_form_click = function() {
    $("#nw_saddr_btn").click(function() {
        var ret = "";
        var validate = true;
        for (i = 0; i < 5; i++) {
            if (i < 4) {
                if (nw_addr_form_validate($(".nw_saddr_div ul li input:eq(" + i + ")").val())) {
                    ret += $(".nw_saddr_div ul li input:eq(" + i + ")").val();
                    if (i < 3) {
                        ret += ".";
                    }
                }
                else {
                    validate = false;
                    break;
                }
            }
            else {
                if ($(".nw_saddr_div ul li input:eq(" + i + ")").val().length) {
                    if (nw_addr_form_cidr_validate($(".nw_saddr_div ul li input:eq(" + i + ")").val())) {
                        ret += "/";
                        ret += $(".nw_saddr_div ul li input:eq(" + i + ")").val();
                    }
                    else {
                        validate = false;
                        break;
                    }
                }
            }
        }

        $(".nw_saddr_div ul li input").css("border-color", "");
        $(".nw_saddr_div ul li input").css("border-width", "");
        if (validate) {
            $("#nw_saddr_link").text(ret);
            $(".dropdown.open").removeClass("open");

            for (i = 0; i < 5; i++) {
                $(".nw_saddr_div ul li input:eq(" + i + ")").val("")
            }
        }
        else {
            $(".nw_saddr_div ul li input:eq(" + i + ")").css("border-color", "red");
            $(".nw_saddr_div ul li input:eq(" + i + ")").css("border-width", "2px");
        }
    });
}

var nw_daddr_form_click = function() {
    $("#nw_daddr_btn").click(function() {
        var ret = "";
        var validate = true;
        for (i = 0; i < 5; i++) {
            if (i < 4) {
                if (nw_addr_form_validate($(".nw_daddr_div ul li input:eq(" + i + ")").val())) {
                    ret += $(".nw_daddr_div ul li input:eq(" + i + ")").val();
                    if (i < 3) {
                        ret += ".";
                    }
                }
                else {
                    validate = false;
                    break;
                }
            }
            else {
                if ($(".nw_daddr_div ul li input:eq(" + i + ")").val().length) {
                    if (nw_addr_form_cidr_validate($(".nw_daddr_div ul li input:eq(" + i + ")").val())) {
                        ret += "/";
                        ret += $(".nw_daddr_div ul li input:eq(" + i + ")").val();
                    }
                    else {
                        validate = false;
                        break;
                    }
                }
            }

        }

        $(".nw_daddr_div ul li input").css("border-color", "");
        $(".nw_daddr_div ul li input").css("border-width", "");
        if (validate) {
            $("#nw_daddr_link").text(ret);
            $(".dropdown.open").removeClass("open");

            for (i = 0; i < 5; i++) {
                $(".nw_daddr_div ul li input:eq(" + i + ")").val("");
            }
        }
        else {
            $(".nw_daddr_div ul li input:eq(" + i + ")").css("border-color", "red");
            $(".nw_daddr_div ul li input:eq(" + i + ")").css("border-width", "2px");
        }
    });
}


var l4_proto_form_click = function() {
    $("#l4_proto_btn").click(function() {
        var checked = $(".l4_proto_div ul li .l4_proto_radio_div input[type='radio']:checked").val();
        var value = "";
        if (parseInt(checked) == 0) {
            value = "None";
            $("#sport").val("");
            $("#sport_link").text("None");
            $(".sport_div").hide();

            $("#dport").val("");
            $("#dport_link").text("None");
            $(".dport_div").hide();
        }
        else if (parseInt(checked) == 1) {
            value = "TCP";
            $(".sport_div").show();
            $(".dport_div").show();
        }
        else {
            value = "UDP";
            $(".sport_div").show();
            $(".dport_div").show();
        }

        $("#l4_proto_link").text(value);
        $(".dropdown.open").removeClass("open");

        for (i = 0; i < $(".l4_proto_div ul li .l4_proto_radio_div input[type='radio']").length; i++) {
            $(".l4_proto_div ul li .l4_proto_radio_div input[type='radio']").prop("checked", false);
        }
    });
}

var port_form_validate = function(port_data) {
    var regex = /\d/;
    if (regex.test(port_data) && (port_data >= 0 && port_data < 65536)) {
        return true;
    }
    //console.log("form_form_validate fail");
    return false;
}

var sport_form_click = function() {
    $("#sport_btn").click(function() {
        if (port_form_validate($("#sport").val())) {
            $("#sport_link").text($("#sport").val());
            $(".dropdown.open").removeClass("open");
            $(".sport_div ul li input").css("border-color", "");
            $(".sport_div ul li input").css("border-width", "");
            
            $("#sport").val("");
        }
        else {
            $(".sport_div ul li input").css("border-color", "red");
            $(".sport_div ul li input").css("border-width", "2px");
        }
    });
}

var dport_form_click = function() {
    $("#dport_btn").click(function() {
        if (port_form_validate($("#dport").val())) {
            $("#dport_link").text($("#dport").val());
            $(".dropdown.open").removeClass("open");
            $(".dport_div ul li input").css("border-color", "");
            $(".dport_div ul li input").css("border-width", "");

            $("#dport").val("");
        }
        else {
            $(".dport_div ul li input").css("border-color", "red");
            $(".dport_div ul li input").css("border-width", "2px");
        }
    });
}

var vlan_id_form_validate = function(vlan_id_data) {
    var regex = /\d/;
    if (regex.test(vlan_id_data) && (vlan_id_data > 0 && vlan_id_data < 4095)) {
        return true;
    }
    //console.log("vlan_id_form_validate fail");
    return false;
}

var vlan_id_form_click = function() {
    $("#vlan_id_btn").click(function() {
        if (vlan_id_form_validate($("#vlan_id").val())) {
            $("#vlan_id_link").text($("#vlan_id").val());
            $(".dropdown.open").removeClass("open");
            $(".vlan_id_div ul li input").css("border-color", "");
            $(".vlan_id_div ul li input").css("border-width", "");

            $("#vlan_id").val("");
        }
        else {
            $(".vlan_id_div ul li input").css("border-color", "red");
            $(".vlan_id_div ul li input").css("border-width", "2px");
        }
    });
}


var output_form_click = function() {
    $("#output_btn").click(function() {
        var ret = "";
        $(".output_div ul li .output_checkbox_div input[type='checkbox']:checked").each(function() {
            ret += $(this).val();
            ret += " "
            //console.log($(this).val());
        });
        if (ret == "") {
            $("#output_link").text("Drop");
        }
        else {
            $("#output_link").text($.trim(ret));
        }
        $(".dropdown.open").removeClass("open");

        for (i = 0; i < $(".output_div ul li .output_checkbox_div input[type='checkbox']").length; i++) {
            $(".output_div ul li .output_checkbox_div input[type='checkbox']").prop("checked", false);
        }
    });
}

var vlan_action_form_click = function() {
    $("#vlan_action_btn").click(function() {
        var checked = $(".vlan_action_div ul li .vlan_action_radio_div input[type='radio']:checked").val();
        var value = "";

        $(".vlan_action_div ul li input").css("border-color", "");
        $(".vlan_action_div ul li input").css("border-width", "");
        if (parseInt(checked) == 0)
        {
            $("#vlan_action_link").text("None");
            $(".dropdown.open").removeClass("open");
        }
        else if (parseInt(checked) == 1) {
            $("#vlan_action_link").text("Strip");
            $(".dropdown.open").removeClass("open");
        }
        else if (parseInt(checked) == 2) {
            if (vlan_id_form_validate($(".vlan_action_div ul li .vlan_action_radio_div input[id='vlan_action_swap']").val())) {
                var id = $(".vlan_action_div ul li .vlan_action_radio_div input[id='vlan_action_swap']").val();
                $("#vlan_action_link").text("Swap ID " + id);
                $(".dropdown.open").removeClass("open");
            }
            else {
                $(".vlan_action_div ul li input[id='vlan_action_swap']").css("border-color", "red");
                $(".vlan_action_div ul li input[id='vlan_action_swap']").css("border-width", "2px");
            }

        }
        else {
            if (vlan_id_form_validate($(".vlan_action_div ul li .vlan_action_radio_div input[id='vlan_action_new']").val())) {
                var id = $(".vlan_action_div ul li .vlan_action_radio_div input[id='vlan_action_new']").val();
                $("#vlan_action_link").text("New ID " + id);
                $(".dropdown.open").removeClass("open");
            }
            else {
                $(".vlan_action_div ul li input[id='vlan_action_new']").css("border-color", "red");
                $(".vlan_action_div ul li input[id='vlan_action_new']").css("border-width", "2px");
            }
        }
       
    });
}

var confirm_form_click = function() {
    $("#confirm_btn").click(function() {

        /*
        if ($("#priority_link").hasClass("color") || $("#idle_link").hasClass("color") || $("#hard_link").hasClass("color") || $("#dl_saddr_link").hasClass("color") || 
            $("#dl_daddr_link").hasClass("color") || $("#nw_saddr_link").hasClass("color") || $("#nw_daddr_link").hasClass("color") || $("#sport_link").hasClass("color") ||
            $("#dport_link").hasClass("color") || $("#vlan_id_link").hasClass("color")) {

            $("#confirm_alert").show();
        }
        */
        //else {
        var flow_cmd = {};
        var common_obj = {};
        var match_obj = {};
        var action_obj = {};

        common_obj["dpid"] = $("#sw_select_title").text();
        common_obj["priority"] = $("#priority_link").text();
        common_obj["idle"] = $("#idle_link").text();
        common_obj["hard"] = $("#hard_link").text();

        match_obj["input"] = $("#input_link").text();
        match_obj["dl_saddr"] = $("#dl_saddr_link").text();
        match_obj["dl_daddr"] = $("#dl_daddr_link").text();
        match_obj["nw_saddr"] = $("#nw_saddr_link").text();
        match_obj["nw_daddr"] = $("#nw_daddr_link").text();
        match_obj["l4_proto"] = $("#l4_proto_link").text();
        match_obj["sport"] = $("#sport_link").text();
        match_obj["dport"] = $("#dport_link").text();
        match_obj["vlan_id"] = $("#vlan_id_link").text();

        action_obj["output"] = $("#output_link").text();
        action_obj["vlan_action"] = $("#vlan_action_link").text();

        flow_cmd["common"] = common_obj;
        flow_cmd["match"] = match_obj;
        flow_cmd["action"] = action_obj;


        //console.log(JSON.stringify(flow_cmd));
        
        $.ajax({
            type: "POST",
            dataType: "json",
            url: $SCRIPT_ROOT + "/_add_flow",
            data: {
                flow_cmd: JSON.stringify(flow_cmd)
            },
            success: function(data) {
            },
            complete: function(data) {
                location.reload();
            }
        });
        //}
    });
}

var reset_form_click = function() {
    $("#reset_btn").click(function() {
        $("#priority").val("");
        $("#priority_link").text("1000");

        $("#idle").val("");
        $("#idle_link").text("0");

        $("#hard").val("");
        $("#hard_link").text("0");

        for (i = 0; i < $(".input_div ul li .input_radio_div input[type='radio']").length; i++) {
            $(".input_div ul li .input_radio_div input[type='radio']").prop("checked", false);
        }
        $("#input_link").text("Any");
        $(".input_div ul li .input_radio_div input[id='input_radio0']").prop("checked", true);

        for (i = 0; i < 6; i++) {
            $(".dl_saddr_div ul li input:eq(" + i + ")").val("");
        }
        $("#dl_saddr_link").text("None");

        for (i = 0; i < 6; i++) {
            $(".dl_daddr_div ul li input:eq(" + i + ")").val("");
        }
        $("#dl_daddr_link").text("None");

        for (i = 0; i < 5; i++) {
            $(".nw_saddr_div ul li input:eq(" + i + ")").val("");
        }
        $("#nw_saddr_link").text("None");

        for (i = 0; i < 5; i++) {
            $(".nw_daddr_div ul li input:eq(" + i + ")").val("");
        }
        $("#nw_daddr_link").text("None");

        for (i = 0; i < $(".l4_proto_div ul li .l4_proto_radio_div input[type='radio']").length; i++) {
            $(".l4_proto_div ul li .l4_proto_radio_div input[type='radio']").prop("checked", false);
        }
        $("#l4_proto_link").text("None");
        $(".l4_proto_div ul li .l4_proto_radio_div input[id='l4_proto0']").prop("checked", true);
        
        $("#sport").val("");
        $("#sport_link").text("None");
        $(".sport_div").hide();

        $("#dport").val("");
        $("#dport_link").text("None");
        $(".dport_div").hide();

        $("#vlan_id").val("");
        $("#vlan_id_link").text("None");

        for (i = 0; i < $(".output_div ul li .output_checkbox_div input[type='checkbox']").length; i++) {
            $(".output_div ul li .output_checkbox_div input[type='checkbox']").prop("checked", false);
        }
        $("#output_link").text("Drop");

        $("#vlan_action_link").text("None");

        $("#confirm_alert").hide();
    });

}

$(document).ready(function() {
    //select_switch_dpid_from_desc();
    var url_split = location.href.split("/");
    //console.log(url_split[3])
    /*
    if (url_split[3] == "Policy") {
        $(".navbar-inverse .navbar-nav li:eq(2) a").css("color", "#EDB95E");   
    }
    */

    $(".operate_btn").tooltip();
    $(".badge").tooltip();
    dropdown_menu_freeze();
    form_control();
    select_switch_dpid_from_list();
    flow_table_checkbox();
    check_all_flow_table();
    delete_flow_click();
});
