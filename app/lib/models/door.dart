class Door {
  final int id;
  final String label;
  final bool isEnabled;
  final String state;

  const Door(
      {required this.id,
      required this.label,
      required this.isEnabled,
      required this.state});

  factory Door.fromJson(Map<String, dynamic> json) {
    return Door(
        id: json['id'] as int,
        label: json['label'] as String,
        isEnabled: json['isEnabled'] as bool,
        state: json['state'] as String);
  }
}
