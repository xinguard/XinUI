XinUI
=====

XinUI is a simple UI for Ryu SDN controller.


##Features

* Support [Ryu SDN controller](https://github.com/osrg/ryu).
* Show below information:
  * Switch description
  * Flow table
  * Network topology
* Add / delete flow entry.


##Setup

* Prerequisite:
  * Ryu (>=3.6)
  * python-pip (>=1.3.1)
 
* Installation:
  * sudo pip install -r pip_requirements.txt

## Usage

Run Ryu app:

```
$ ryu-manager --observe-links ryu.topology.switches ryu.app.rest_topology ryu.app.ofctl_rest
```

Run XinUI:

```
$ python xinui.py
```

Default running on http://0.0.0.0:5566/

## Support

Full test on Chrome during design, so can not sure other browser can work smooth.


All of the code is freely available under the MIT license.




   
