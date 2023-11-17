class Door {
  final int id;
  final String label;
  final bool isEnabled;
  final String state;
  final int openDuration;
  final int closeDuration;

  const Door(this.id, this.label, this.isEnabled, this.state, this.openDuration,
      this.closeDuration);

  Door.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        label = json['label'],
        isEnabled = json['isEnabled'],
        state = json['state'] as String,
        openDuration = json['openDuration'],
        closeDuration = json['closeDuration'];
}
