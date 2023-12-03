class UpdateDoor {
  final String label;
  final bool isEnabled;
  final int closeDuration;
  final int openDuration;

  const UpdateDoor({
    required this.label,
    required this.isEnabled,
    required this.closeDuration,
    required this.openDuration,
  });

  Map<String, dynamic> toJson() => {
        'label': label,
        'isEnabled': isEnabled,
        'openDuration': openDuration,
        'closeDuration': closeDuration
      };
}
