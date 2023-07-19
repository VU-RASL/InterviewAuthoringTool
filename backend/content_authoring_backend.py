from flask import Flask, request
from regraph import NXGraph, Rule
from flask_cors import CORS

app = Flask(__name__) #initializing Flask app 
CORS(app) #adding flask app to CORS to allow communication 

graph = NXGraph() #initializing the graph

#Initialization 
@app.route("/init", methods=["GET", "POST", "PUT"])
def init():
    global graph
    graph = NXGraph()
    #Getting the init_node from the client 
    dialogue = request.get_json()["init_node"]
    #print("Init next ID", dialogue['NextDialogID'])
    graph.add_nodes_from([(dialogue["id"], dialogue)])
    #print(format_d3(graph.to_d3_json()))
    return format_d3(graph.to_d3_json())

#Initializing graph from template
@app.route("/init_graph", methods=['GET', 'POST', 'PUT'])
def init_graph():
    global graph
    graph=NXGraph()

    init_graph = request.get_json()['init_graph']

    #print("graph", init_graph['links'])
    graph.add_nodes_from([(node['id'], node) for node in init_graph['nodes']])    #graph.add_edges_from(init_graph['links'])
    graph.add_edges_from([(edge['source'], edge['target'], edge) for edge in init_graph['links']])
    return format_d3(graph.to_d3_json())

#When the last node is dangling, then you go on to add a node at the end of the graph
@app.route("/insert_node", methods=["GET", "POST", "PUT"])
def insert_node():
    #You need the global keyword to access the "graph" variable. 
    global graph

    #Getting the message from the client. 
    dialogues = request.get_json()
    #print("dialogues", dialogues)

    
    #get the name of the current node after which you want to add a new question
    current_node = dialogues["current_node"]
    print("current node Next id", current_node)
    #get the dialogue object of the next node: the id of this can be "new_question" 
    #Note: Make sure that you prompt the user to change the name of the node, otherwise there will be a clash
    #Do not allow the user to add any nodes until they have changed the name of this one. Throw an error 
    node_to_add = dialogues["node_to_add"]
    graph.add_nodes_from([(node_to_add['id'], node_to_add)])
    graph.add_edges_from([(current_node['id'], node_to_add['id'])])
    
    #if the Next ID array is empty with only '' in it, then we are appending the first child
    if current_node['NextDialogID'][0]=='':
        current_node['NextDialogID'][0] = node_to_add['id']
    else:
        current_node["NextDialogID"].append(node_to_add['id'])
    #print("updated_node", current_node)
    print("Children array", current_node["NextDialogID"])
    graph.update_node_attrs(current_node['id'], current_node)
    #Check to see if the current node is empty - if no then proceed. 
                
    return format_d3(graph.to_d3_json())

def format_d3(data):

    #data = data.to_d3_json()
    nodes = data["nodes"]
    links = data["links"]
    #print("INPUT", nodes)

    #print("nodes", nodes)

    formated_nodes = []
    #@todo: make this more general
    for i in nodes:
        formated_data_sample = {"id":i['id']}
        #formated_data_sample= {'data': {'label': i['attrs']['DialogText']}}
        keys = i["attrs"].keys()
        #print(keys)
        for key in keys:
            if key!="id":
                d = i["attrs"][key]["data"]
                #print("data in format", d)

                if key=='position':
                    formated_data_sample[key]={d[0][0]:d[0][1],d[1][0]:d[1][1]  }
                
                elif key =='data':
                    formated_data_sample[key]={d[0][0]: d[0][1]}
                elif key.strip() =='alternates':
                    #print("Here alternates")
                    formated_data_sample[key]=d
                elif key.strip()=='NextDialogID':
                    print(d)
                    formated_data_sample[key]=d
                else:
                    
                    formated_data_sample[key] = i["attrs"][key]["data"][0]
                #if list(i["attrs"][key]["data"][0].keys())!=[]:
                #    additional_keys = list(i['attrs'][key].keys())
                #    for k in additional_keys:
                #        formated_data_sample[key][k] = list(i['attrs'][key]['data'][0]['attrs'][k]["data"][0])
       # print("OUTPUT", formated_data_sample)
        print("************************************8")
        formated_nodes.append(formated_data_sample)
            
        
    
    formatted_links = []
    for i in links:
        formatted_link = {"source": i["source"],
                        "target":i["target"]}
        keys = i["attrs"].keys()
        #print(keys)
        for key in keys:
            formatted_link[key] = i["attrs"][key]["data"][0]
        #print(formatted_link)
        formatted_links.append(formatted_link)

    new_data={}
    new_data['nodes'] = formated_nodes
    new_data['links'] = formatted_links
   # print(new_data)
        
    return new_data


@app.route("/relabel_node", methods=["GET", "POST", "PUT"])
def relabel_node():
    global graph 
    names = request.get_json()
    graph.relabel_node(names["node_to_relabel"], names["relabel_to"])
    #print(graph.nodes())
    #print(graph.edges())

    return format_d3(graph.to_d3_json())

@app.route("/reset", methods=["GET", "POST", "PUT"])
def reset():
    global graph
    graph = NXGraph()
    init()
    return format_d3(graph.to_d3_json())
    
#Just in case we want to add a connection from one node to another 
#Send in the source and target node and the type of node. 
@app.route("/create_edge", methods=["GET", "POST", "PUT"])
def create_edge():

    global graph
    nodes = request.get_json()
    #Get the id of the source node 
    source_node = nodes["source_node"]
    type = nodes["type"]

    target_node = nodes["target_node"]
    if graph.exists_edge(source_node, target_node):
        #return format_d3(graph.to_d3_json())
        return "true"
    else:    
        graph.add_edges_from([(source_node, target_node, {"label": type})])
        predecessor = graph.get_node(source_node)
        predecessor["NextDialogID"] = list(predecessor["NextDialogID"])
        if predecessor['NextDialogID'][0]=='':
            predecessor['NextDialogID'][0] = target_node
            graph.update_node_attrs(source_node, predecessor)

        else: 
            predecessor["NextDialogID"].append(target_node)
            graph.update_node_attrs(source_node, predecessor)

        return format_d3(graph.to_d3_json())


#Update edge
@app.route("/update_edge", methods=["GET", "POST", "PUT"])
def update_edge():

    global graph
    edge = request.get_json()['edge_to_update']
    graph.update_edge_attrs(edge['source'], edge['target'], edge)


    return format_d3(graph.to_d3_json())

#Checking if edge exists 
@app.route("/exists_edge", methods=["PUT", "GET", 'POST'])
def exists_edge():
    global graph
    message = request.get_json()
    if graph.exists_edge(message['source'], message['target']):
        return "true"
    else:
        return "false"
        

@app.route("/remove_edge", methods=["GET", "PUT", "POST"])
def remove_edge():

    global graph 
    nodes = request.get_json()
    source = nodes['source_node']
    target = nodes['target_node']

    graph.remove_edge(source, target)
    predecessor = graph.get_node(source)
    predecessor["NextDialogID"] = list(predecessor["NextDialogID"])
    predecessor["NextDialogID"].remove(target)
    if predecessor["NextDialogID"]==[]:
        predecessor["NextDialogID"]=['']
    graph.update_node_attrs(source, predecessor)


    return format_d3(graph.to_d3_json())

@app.route("/exists_node", methods=["GET", "PUT", "POST"])
def exists_node():    
    global graph
    #print("node exists?", request.get_json()['node_to_check'])
    node_to_check = request.get_json()["node_to_check"]

    #this gives us a list of ids 
    all_nodes = list(graph.nodes())
    print(all_nodes)

    #If the node you want to check is in the list of nodes that exist, then return true
    if node_to_check in all_nodes:
        print(True)
        return "true"
    else:
        print(False)
        return "false" 

#@todo: Think about how to allow the user to change the position of a question
@app.route("/delete_node", methods=["GET", "POST", "PUT"])
def delete_node():
    global graph
    node_to_delete_id= request.get_json()["node_to_delete"] # this is just the id of the node
    print("node to delete", node_to_delete_id)
    out_edges =graph.out_edges(node_to_delete_id)
    print("out_edges", out_edges)
    in_edges = graph.in_edges(node_to_delete_id)
    print("in_edges", in_edges)

    graph.remove_node(node_to_delete_id)

    for ie in in_edges:
        print("In edge", ie)
        source = ie[0]
        predecessor = graph.get_node(source)
        
        print("predecessor", list(predecessor["NextDialogID"]))
        #pos = list(predecessor['NextDialogID']).index(node_to_delete_id)
        predecessor["NextDialogID"] = list(predecessor['NextDialogID'])
        predecessor["NextDialogID"].remove(node_to_delete_id)
        if predecessor["NextDialogID"]==[]:
            predecessor["NextDialogID"]=['']
        
        print("Next children", predecessor['NextDialogID'])#predecessor["NextDialogID"].pop(pos)
        graph.update_node_attrs(source, predecessor)
    
   

    return format_d3(graph.to_d3_json())

""" If the node is the last one 
    if (len(out_edges)==0):
        #@todo: Check here to see if the node to delete has an 
        # in-edge with type positive or negative. If yes, then prompt that the node is 
        # a follow up to the previous question. 
        #convert the yes/no successor back to a normal node then. 
        #print("Node to delete", node_to_delete)
        graph.remove_node(node_to_delete)

    elif len(list(in_edges))==1 and len(list(out_edges))==1:
        #predecessor = list(graph.predecessors(node_to_delete))[0]
        predecessor = graph.in_edges(node_to_delete)[0][0]
        print(predecessor)
        #successor = list(graph.successors(node_to_delete))[0]
        successor = graph.out_edges(node_to_delete)[0][1]
        print(successor)
        
        graph.remove_node(node_to_delete)
        graph.add_edge(predecessor, successor)
"""
"""@app.route("/check_fully_connected", methods = ["GET", "PUT", "POST"])
def check_fully_connected():

    #create an adjacency matrix of the nodes 
    #check all the edges to mark connections. 
    #if the adjacency matrix has a zero between two nodes
    # then there is not connection between the two and the graph is not fully connected.

    return True"""

"""#Deleting yes no type at end 
@app.route("/delete_yes_no_at_end", methods=["GET", "PUT", "POST"])
def delete_yes_no_at_end():
    global graph
    
    node_to_delete = request.get_json()["node_to_delete"]
    print("Node to delete", node_to_delete)

    pattern_to_delete2 = NXGraph()
    pattern_to_delete2.add_nodes_from([(node_to_delete, {"filterType": "SentimentFilter"}),
                                        ("b"), ("c")])
    pattern_to_delete2.add_edges_from([
                                    (node_to_delete, "b", {"sentiment":"yes"}),
                                    (node_to_delete, 'c', {"sentiment": "no"})])
    #plot_graph(pattern_to_delete2)

    rule = Rule.from_transform(pattern_to_delete2)
    rule.inject_remove_node(node_to_delete)
    rule.inject_remove_node("b")
    rule.inject_remove_node("c")

    instances = graph.find_matching(pattern_to_delete2)
    graph.rewrite(rule, instances[0])

    #if (len(graph.out_edges(node_to_delete))==2):
    #    successors = list(graph.successors(node_to_delete))
        #if(graph.out_edges(successors[0])==0 and graph.out_edges(successors[1])==0)

    return format_d3(graph.to_d3_json())

#Deleting yes-no type in between 
@app.route("/delete_yes_no_in_between", methods=["GET", "PUT", "POST"])
def delete_yes_no_in_between():

    global graph

    node_to_delete = request.get_json()["node_to_delete"]
    print("Node to delete", node_to_delete)

    #When there in only 1 incoming edge 

    predecessors = list(graph.predecessors(node_to_delete))
    in_edges = list(graph.in_edges(node_to_delete))
    print("in_edges", in_edges)
    out_edges = list(graph.out_edges(node_to_delete))
    print("out_edges", out_edges)
    print("Predecessors", predecessors)
    successors = list(graph.successors(node_to_delete))
    print("Successors", successors)
   """ """if(len(out_edges)==2):
        if (len(predecessors)==1):
            #If both the successors have the same successor 
            if(list(graph.successors(successors[0]))[0]==list(graph.successors(successors[1]))[0]):
                pattern = NXGraph() 
                pattern.add_nodes_from([(list(graph.predecessors(node_to_delete))[0])]) #adding the previous node
                pattern.add_nodes_from([(node_to_delete, {"filterType":"SentimentFilter"}), 
                                    ("b"), ("c"), ("d")])
                pattern.add_edges_from([(node_to_delete, "b", {"sentiment": "yes"}), 
                                        (node_to_delete, "c", {"sentiment": "no"}),
                                        ("b", "d"),
                                        ("c", "d")])

                rule = Rule.from_transform(pattern)
                rule.inject_remove_node(node_to_delete)
                rule.inject_remove_node("b")
                rule.inject_remove_node("c")
                rule.inject_add_edge(predecessors[0], "d")

                instances= graph.find_matching(pattern)
                if len(instances) !=0:
                    graph.rewrite(rule, instances[0])""""""

    graph.remove_node(node_to_delete)

    return format_d3(graph.to_d3_json())"""

@app.route("/update_node_attrs", methods=["GET", 'PUT', 'POST'])
def update_node_attrs():

    global graph
    #This is the full JSON being sent by the client 
    node_to_update = request.get_json()["node_to_update"]
    #print("Node to Update", node_to_update)
    if (node_to_update['alternates']==[]):
        node_to_update['alternates']=['']

    graph.update_node_attrs(node_to_update["id"], node_to_update)

    return format_d3(graph.to_d3_json())

#This is for onNodesChange when  the position changes
@app.route("/on_position_change", methods=["GET", "PUT", "POST"])
def on_position_change():
    global graph
    node_to_update = request.get_json()['node_to_update']
    #print("UPDATE ALL", node_to_update['id'], node_to_update['position'])
    
    updated_node = graph.get_node(node_to_update['id'])
    #print(updated_node)
    position = node_to_update['position']
    #print("Position", position)
    updated_node['position']= {"x": position['x'], "y": position['y']}
    graph.update_node_attrs(node_to_update['id'], updated_node)
    
    return format_d3(graph.to_d3_json())                                                                                                                                                                                                                                                             

# main driver function
if __name__ == '__main__':
 
    # run() method of Flask class runs the application
    # on the local development server.
    app.run()