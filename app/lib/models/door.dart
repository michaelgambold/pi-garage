class Door {
  final int id;
  final String label;
  final bool isEnabled;
  final String state;

  const Door(this.id, this.label, this.isEnabled, this.state);

  Door.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        label = json['label'],
        isEnabled = json['isEnabled'],
        state = json['state'] as String;
}
