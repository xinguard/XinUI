#
# Copyright (C) 2014 Xinguard Inc.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.


# -*- coding: utf-8 -*-

from flask import Flask
from flask import render_template, jsonify, request, g, abort, redirect, url_for

import json

#from xinui.rest import Rest
from rest import Rest

app = Flask(__name__)

global_flow_table = {}

# Summary page
@app.route("/")
def summary():
    sw_desc = Rest.get_switch_desc()
    if sw_desc is False:
        abort(404)
    return render_template("summary.html", sw_desc=sw_desc)

# Policy page
@app.route("/policy/")
def policy():
    sw_dpid_list = Rest.get_switch_list()

    if sw_dpid_list is False:
        abort(404)

    return render_template("policy.html", sw_dpid_list=sw_dpid_list)

@app.route("/policy/<dpid>")
def dpid_policy(dpid):
    sw_dpid_list = Rest.get_switch_list()

    if sw_dpid_list is False or int(dpid) not in sw_dpid_list:
        abort(404)

    flow_table = None
    flow_table = Rest.get_flow_table(dpid)
    global global_flow_table
    global_flow_table = flow_table
    port = Rest.get_switch_port(dpid)

    return render_template("policy.html", sw_dpid_list=sw_dpid_list, dpid=dpid, port=port, flow_table=flow_table) 

# Topology page
@app.route("/topology")
def topology():
    topo = Rest.get_topology()
    return render_template("topology.html", topo=topo)

@app.route("/_query_flow/")
def query_flow(dpid):
    #dpid = request.args.get("dpid")
    flow_table = Rest.get_flow_table(dpid)

    #print flow_table
    
    return render_template("policy.html", flow_table=flow_table)
    #return jsonify(flow_table)

@app.route("/_query_port")
def query_port():
    dpid = request.args.get("dpid")
    port = Rest.get_switch_port(dpid)

    return jsonify(port)

@app.route("/_add_flow", methods=["POST"])
def add_flow():
    req = json.loads(request.form["flow_cmd"])

    flow_cmd = {}
    match_dict = {}
    action_list = []

    flow_cmd["dpid"] = req["common"]["dpid"]
    flow_cmd["priority"] = req["common"]["priority"]
    flow_cmd["idle_timeout"] = req["common"]["idle"]
    flow_cmd["hard_timeout"] = req["common"]["hard"]

    if req["match"]["input"] != "Any":
        match_dict["in_port"] = int(req["match"]["input"])

    if req["match"]["dl_saddr"] != "None":
        match_dict["dl_src"] = req["match"]["dl_saddr"]

    if req["match"]["dl_daddr"] != "None":
        match_dict["dl_dst"] = req["match"]["dl_daddr"]

    if req["match"]["nw_saddr"] != "None":
        match_dict["nw_src"] = req["match"]["nw_saddr"]

    if req["match"]["nw_daddr"] != "None":
        match_dict["nw_dst"] = req["match"]["nw_daddr"]

    if req["match"]["nw_saddr"] != "None" or req["match"]["nw_daddr"] != "None" or req["match"]["l4_proto"]:
        match_dict["dl_type"] = 2048

    if req["match"]["l4_proto"] != "None":
        if req["match"]["l4_proto"] == "TCP":
            match_dict["nw_proto"] = 6
        elif req["match"]["l4_proto"] == "UDP":
            match_dict["nw_proto"] = 17

    if req["match"]["sport"] != "None":
        match_dict["tp_src"] = int(req["match"]["sport"])

    if req["match"]["dport"] != "None":
        match_dict["tp_dst"] = int(req["match"]["dport"])

    if req["match"]["vlan_id"] != "None":
        match_dict["dl_vlan"] = int(req["match"]["vlan_id"])

    if req["action"]["output"] != "Drop":
        for value in req["action"]["output"].split(" "):
            action_dict = {}
            action_dict["port"] = int(value)
            action_dict["type"] = "OUTPUT"
            action_list.append(action_dict)

    if req["action"]["vlan_action"] != "None":
        if "Strip" in req["action"]["vlan_action"]:
            action_dict = {}
            action_dict["type"] = "POP_VLAN"
            action_list.append(action_dict)
        elif "Swap" in req["action"]["vlan_action"]:
            action_dict = {}
            action_dict["field"] = "vlan_vid"
            action_dict["value"] = req["action"]["vlan_action"].split(" ")[-1]
            action_dict["type"] = "SET_FIELD"
            action_list.append(action_dict)
        elif "New" in req["action"]["vlan_action"]:
            push_vlan_dict = {}
            push_vlan_dict["ethertype"] = 33024
            push_vlan_dict["type"] = "PUSH_VLAN"
            action_list.append(push_vlan_dict)

            action_dict = {}
            action_dict["field"] = "vlan_vid"
            action_dict["value"] = req["action"]["vlan_action"].split(" ")[-1]
            action_dict["type"] = "SET_FIELD"
            action_list.append(action_dict)


    flow_cmd["match"] = match_dict
    flow_cmd["actions"] = action_list

    #print json.dumps(flow_cmd)
    Rest.add_flow(json.dumps(flow_cmd))

    return "foo"

@app.route("/_del_flow", methods=["POST"])
def del_flow():
    index = request.form["index"]

    flow_cmd = {}
    match_dict = {}

    for key, list in global_flow_table.iteritems():
        flow_cmd["dpid"] = key
        match_dict = list[int(index)]["match"]

    flow_cmd["match"] = match_dict
    #print json.dumps(flow_cmd)

    Rest.del_flow(json.dumps(flow_cmd))
    return "foo"

@app.errorhandler(404)
def page_not_found(error):
    return render_template("page_not_found.html"), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5566, debug=False)

