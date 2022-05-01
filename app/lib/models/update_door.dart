class UpdateDoor {
  final String label;
  final bool isEnabled;

  const UpdateDoor({required this.label, required this.isEnabled});

  Map<String, dynamic> toJson() => {'label': label, 'isEnabled': isEnabled};
}
