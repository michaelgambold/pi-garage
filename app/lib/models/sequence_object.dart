class SequenceObject {
  final String action;
  final int duration;
  final String target;

  SequenceObject(
      {required this.action, required this.duration, required this.target});

  factory SequenceObject.fromJson(Map<String, dynamic> json) {
    return SequenceObject(
        action: json['action'] as String,
        duration: json['duration'] as int,
        target: json['target'] as String);
  }
}
