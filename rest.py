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

import requests
import json
import networkx as nx
from networkx.readwrite import json_graph

RYU_SERVER_URL = "http://127.0.0.1:8080"

def hex2decimal(hex):
    i = int(hex, 16)
    return str(i)

class Rest():
    def __init__(self):
        pass

    @staticmethod
    def get_switch_list():
        get_switch_list_url = "%s/stats/switches" % (RYU_SERVER_URL)
        try:
            req = requests.get(get_switch_list_url)
        except requests.exceptions.ConnectionError:
            return False

        
        return req.json()


    @staticmethod
    def get_switch_desc():
        data = Rest.get_switch_list()
        if data is False:
            return False
        desc_list = []
        desc_dict = {}
        for dpid in data:
            get_switch_desc_url = "%s/stats/desc/%s" % (RYU_SERVER_URL, dpid)
            try:
                req = requests.get(get_switch_desc_url)
            except requests.exceptions.ConnectionError:
                return False

            flow_table = Rest.get_flow_table(dpid)
            for dpid, f_list in flow_table.iteritems():
                flow_num = len(f_list)

            for dpid, sw_dict in req.json().iteritems():
                sw_dict["flow_num"] = flow_num
                desc_dict[dpid] = sw_dict

        desc_list.append(desc_dict)
        #print desc_list

        return desc_list

    @staticmethod
    def get_flow_table(dpid):
        get_flow_table_url = "%s/stats/flow/%s" % (RYU_SERVER_URL, dpid)
        req = requests.get(get_flow_table_url)
        
        return req.json()
        
    @staticmethod
    def get_switch_port(dpid):
        get_switch_port_url = "%s/stats/port/%s" % (RYU_SERVER_URL, dpid)
        req = requests.get(get_switch_port_url)

        for dpid, p_list in req.json().iteritems():
            p_list.sort()
            del p_list[-1]
            return p_list
            


        #return req.json()


    @staticmethod
    def add_flow(req_data):
        add_flow_url = "%s/stats/flowentry/add" % (RYU_SERVER_URL)
        try:
            req = requests.post(add_flow_url, data=req_data)
        except requests.exceptions.eonnectionError:
            return False

        return req.status_code

    @staticmethod
    def del_flow(req_data):
        del_flow_url = "%s/stats/flowentry/delete" % (RYU_SERVER_URL)
        try:
            req = requests.post(del_flow_url, data=req_data)
        except requests.exceptions.ConnectionError:
            return False

        return req.status_code

    @staticmethod
    def get_topology():
        node_url = "%s/v1.0/topology/switches" % (RYU_SERVER_URL)
        link_url = "%s/v1.0/topology/links" % (RYU_SERVER_URL)
        try:
            node_req = requests.get(node_url)
            link_req = requests.get(link_url)
        except requests.exceptions.ConnectionError:
            return False


        G = nx.Graph()
        for node_group in node_req.json():
            for node in node_group["ports"]:
                dpid = hex2decimal(node['dpid'])
                G.add_node(dpid)


        for link_group in link_req.json():
            for link in link_group:
                src_dpid = hex2decimal(link_group["src"]["dpid"])
                dst_dpid = hex2decimal(link_group["dst"]["dpid"])
                G.add_edge(src_dpid, dst_dpid)

        graph = json_graph.node_link_data(G)
        return json.dumps(graph)





