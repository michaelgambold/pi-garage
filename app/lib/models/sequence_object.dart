class SequenceObject {
  final String action;
  final int duration;
  final String target;

  const SequenceObject({
    required this.action,
    required this.duration,
    required this.target,
  });

  SequenceObject.fromJson(Map<String, dynamic> json)
      : action = json['action'],
        duration = json['duration'],
        target = json['target'];

  Map<String, dynamic> toJson() =>
      {'action': action, 'duration': duration, 'target': target};
}
