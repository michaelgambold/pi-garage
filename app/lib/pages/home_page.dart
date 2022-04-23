import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      // This call to setState tells the Flutter framework that something has
      // changed in this State, which causes it to rerun the build method below
      // so that the display can reflect the updated values. If we changed
      // _counter without calling setState(), then the build method would not be
      // called again, and so nothing would appear to happen.
      _counter++;
    });
  }

  void _buttonPressed() {
    print("hi");
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.settings),
            tooltip: 'Open shopping cart',
            onPressed: () {
              Navigator.pushNamed(context, '/settings');
            },
          ),
        ],
      ),
      body: Center(
          // Center is a layout widget. It takes a single child and positions it
          // in the middle of the parent.
          child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Column>[
            Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const <Widget>[
                  Text("Door 1"),
                  IconButton(
                    icon: Icon(Icons.volume_up),
                    tooltip: 'Increase volume by 10',
                    onPressed: null,
                  ),
                ]),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const <Widget>[
                Text("Door 2"),
                IconButton(
                  icon: Icon(Icons.volume_up),
                  tooltip: 'Door 2',
                  onPressed: null,
                )
              ],
            ),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Card(
                    color: Colors.grey[400],
                    child: Container(
                        padding: const EdgeInsets.all(80),
                        child: Column(children: <Widget>[
                          const Text("Door 3"),
                          IconButton(
                            icon: const Icon(Icons.volume_up),
                            tooltip: 'Door 3',
                            onPressed: () {
                              print("hi");
                            },
                          ),
                        ])))
              ],
            )
          ])),
    );
  }
}
